require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
    {
        name: 'iPhone 15 Pro',
        sku: 'APPL-IP15P-256',
        category: 'Electronics',
        price: 134900,
        stockQuantity: 25,
        lowStockThreshold: 5
    },
    {
        name: 'Samsung Galaxy S24',
        sku: 'SAMS-S24-128',
        category: 'Electronics',
        price: 79999,
        stockQuantity: 18,
        lowStockThreshold: 5
    },
    {
        name: 'Sony WH-1000XM5',
        sku: 'SONY-WH1000-BLK',
        category: 'Audio',
        price: 29990,
        stockQuantity: 42,
        lowStockThreshold: 10
    },
    {
        name: 'MacBook Air M3',
        sku: 'APPL-MBA-M3-256',
        category: 'Laptops',
        price: 114900,
        stockQuantity: 12,
        lowStockThreshold: 3
    },
    {
        name: 'Logitech MX Master 3S',
        sku: 'LOGI-MXM3S-GRY',
        category: 'Accessories',
        price: 9495,
        stockQuantity: 35,
        lowStockThreshold: 8
    },
    {
        name: 'Dell UltraSharp 27"',
        sku: 'DELL-U2723-27',
        category: 'Monitors',
        price: 52999,
        stockQuantity: 8,
        lowStockThreshold: 3
    },
    {
        name: 'Apple AirPods Pro 2',
        sku: 'APPL-APP2-WHT',
        category: 'Audio',
        price: 24900,
        stockQuantity: 3,
        lowStockThreshold: 10
    },
    {
        name: 'Keychron K8 Pro',
        sku: 'KEYCH-K8P-RGB',
        category: 'Accessories',
        price: 8999,
        stockQuantity: 22,
        lowStockThreshold: 5
    },
    {
        name: 'iPad Pro 12.9"',
        sku: 'APPL-IPAD-PRO12',
        category: 'Tablets',
        price: 112900,
        stockQuantity: 6,
        lowStockThreshold: 2
    },
    {
        name: 'Samsung T7 SSD 1TB',
        sku: 'SAMS-T7-1TB',
        category: 'Storage',
        price: 9999,
        stockQuantity: 0,
        lowStockThreshold: 10
    },
    {
        name: 'Anker PowerCore 26800',
        sku: 'ANKR-PC26800',
        category: 'Accessories',
        price: 4999,
        stockQuantity: 50,
        lowStockThreshold: 15
    },
    {
        name: 'Google Pixel 8 Pro',
        sku: 'GOOG-PX8P-256',
        category: 'Electronics',
        price: 106999,
        stockQuantity: 14,
        lowStockThreshold: 5
    },
    {
        name: 'LG C3 OLED 55"',
        sku: 'LG-C3-55-OLED',
        category: 'TVs',
        price: 139990,
        stockQuantity: 4,
        lowStockThreshold: 2
    },
    {
        name: 'Bose SoundLink Flex',
        sku: 'BOSE-SLFLEX-BLK',
        category: 'Audio',
        price: 14900,
        stockQuantity: 28,
        lowStockThreshold: 8
    },
    {
        name: 'Nintendo Switch OLED',
        sku: 'NINT-SWCH-OLED',
        category: 'Gaming',
        price: 34999,
        stockQuantity: 9,
        lowStockThreshold: 5
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        const products = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${products.length} products`);

        console.log('\nSeeded Products:');
        products.forEach((p) => {
            const status = p.stockQuantity === 0 ? '❌ OUT' : p.stockQuantity <= p.lowStockThreshold ? '⚠️ LOW' : '✅ OK';
            console.log(`  ${status} ${p.name} - Stock: ${p.stockQuantity}, Price: ₹${p.price}`);
        });

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
