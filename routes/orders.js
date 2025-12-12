const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-stripe-session', async (req, res) => {
  try {
    const { items, email } = req.body;

    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              images: [product.image]
            },
            unit_amount: Math.round(product.price * 100)
          },
          quantity: item.quantity
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = await Order.create({
      customerEmail: email,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      paymentMethod: 'stripe',
      paymentId: session.id,
      status: 'completed'
    });

    // Send email with download links
    const products = await Product.find({ _id: { $in: items.map(i => i.productId) } });
    const downloadLinks = products.map(p => `<li><strong>${p.title}</strong>: <a href="${p.downloadLink}">${p.downloadLink}</a></li>`).join('');
    
    await sendEmail(
      email,
      'Your UdayTechX Purchase - Download Links',
      `<h2>Thank you for your purchase!</h2>
       <p>Here are your download links:</p>
       <ul>${downloadLinks}</ul>
       <p>If you have any questions, reply to this email.</p>`
    );

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { items, email } = req.body;

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const options = {
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      customerEmail: email,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      paymentMethod: 'razorpay',
      paymentId: order.id,
      status: 'completed'
    });

    // Send email with download links
    const products = await Product.find({ _id: { $in: items.map(i => i.productId) } });
    const downloadLinks = products.map(p => `<li><strong>${p.title}</strong>: <a href="${p.downloadLink}">${p.downloadLink}</a></li>`).join('');
    
    await sendEmail(
      email,
      'Your UdayTechX Purchase - Download Links',
      `<h2>Thank you for your purchase!</h2>
       <p>Here are your download links:</p>
       <ul>${downloadLinks}</ul>
       <p>If you have any questions, reply to this email.</p>`
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mock-payment', async (req, res) => {
  try {
    const { email, productId, paymentMethod, amount } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send email with download link
    try {
      await sendEmail(
        email,
        `Your UdayTechX Purchase - ${product.title}`,
        `<h2>Payment Successful!</h2>
         <p>Thank you for purchasing <strong>${product.title}</strong></p>
         <p><strong>Download Link:</strong> <a href="${product.downloadLink}">${product.downloadLink}</a></p>
         <p>Amount Paid: $${amount}</p>
         <p>Payment Method: ${paymentMethod}</p>`
      );
      console.log('Email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.json({ 
      success: true, 
      message: 'Payment successful!',
      downloadLink: product.downloadLink
    });
  } catch (error) {
    console.error('Mock payment error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;