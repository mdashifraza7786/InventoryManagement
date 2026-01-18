const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, sku, category, price, stockQuantity, lowStockThreshold } = req.body;

        const existingSku = await Product.findOne({ sku });
        if (existingSku) {
            return res.status(400).json({ message: 'SKU already exists' });
        }

        const product = new Product({
            name,
            sku,
            category,
            price,
            stockQuantity,
            lowStockThreshold
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, sku, category, price, stockQuantity, lowStockThreshold } = req.body;

        const existingSku = await Product.findOne({ sku, _id: { $ne: req.params.id } });
        if (existingSku) {
            return res.status(400).json({ message: 'SKU already exists' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, sku, category, price, stockQuantity, lowStockThreshold },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts
};
