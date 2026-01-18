const Sale = require('../models/Sale');
const Product = require('../models/Product');

const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in sale' });
        }

        const saleItems = [];
        let totalAmount = 0;
        const lowStockAlerts = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
                });
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            saleItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
                subtotal
            });

            product.stockQuantity -= item.quantity;
            await product.save();

            if (product.stockQuantity <= product.lowStockThreshold) {
                lowStockAlerts.push({
                    productId: product._id,
                    productName: product.name,
                    currentStock: product.stockQuantity,
                    threshold: product.lowStockThreshold
                });
            }
        }

        const sale = new Sale({
            items: saleItems,
            totalAmount,
            paymentMethod: paymentMethod || 'cash'
        });

        const savedSale = await sale.save();

        res.status(201).json({
            sale: savedSale,
            lowStockAlerts
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('items.product');
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDailySales = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const sales = await Sale.find({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalSales = sales.length;

        res.json({
            totalRevenue,
            totalSales,
            sales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSale,
    getSales,
    getSale,
    getDailySales
};
