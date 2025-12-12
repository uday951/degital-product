const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

const sampleProducts = [
  {
    title: 'Anti-Gravity Shoes X1',
    slug: 'anti-gravity-shoes-x1',
    price: 299.99,
    description: 'Revolutionary footwear that defies gravity. Walk on air with quantum levitation technology. Features adjustable hover height and energy-efficient design.',
    category: 'physical',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    splineEmbedUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    inStock: true
  },
  {
    title: 'Hover Orb Pro',
    slug: 'hover-orb-pro',
    price: 199.99,
    description: 'Floating sphere powered by magnetic field manipulation. Perfect for home decoration or as a personal assistant device. Includes voice control and RGB lighting.',
    category: 'physical',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    inStock: true
  },
  {
    title: 'Gravity Defier Belt',
    slug: 'gravity-defier-belt',
    price: 499.99,
    description: 'Personal anti-gravity device worn as a belt. Reduce your weight by up to 50% with quantum field technology. Perfect for athletes and adventurers.',
    category: 'physical',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    inStock: true
  },
  {
    title: 'Levitation Pad',
    slug: 'levitation-pad',
    price: 149.99,
    description: 'Wireless charging pad that levitates your devices while charging. Compatible with all Qi-enabled devices. Futuristic design with neon accents.',
    category: 'physical',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    inStock: true
  },
  {
    title: 'Anti-Gravity Training Program',
    slug: 'anti-gravity-training-digital',
    price: 49.99,
    description: 'Digital course teaching you how to maximize your anti-gravity equipment. Includes video tutorials, workout plans, and expert guidance.',
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    inStock: true
  },
  {
    title: 'Quantum Hover Board',
    slug: 'quantum-hover-board',
    price: 899.99,
    description: 'The ultimate personal transportation device. Hover up to 2 feet off the ground with speeds up to 25 mph. Includes safety features and app control.',
    category: 'physical',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    inStock: true
  },
  {
    title: 'Floating Plant Pot',
    slug: 'floating-plant-pot',
    price: 79.99,
    description: 'Magnetic levitation plant pot that rotates 360 degrees. Perfect for small plants and succulents. Includes LED grow lights.',
    category: 'physical',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
    inStock: true
  },
  {
    title: 'Anti-Gravity 3D Models Pack',
    slug: 'anti-gravity-3d-models-pack',
    price: 29.99,
    description: 'Digital pack of 50+ high-quality 3D models of anti-gravity devices. Perfect for designers and developers. Includes Spline, Blender, and FBX formats.',
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    inStock: true
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products added successfully');
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });