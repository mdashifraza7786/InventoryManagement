import React, { useState, useEffect } from 'react';
import { FiPlus, FiPackage, FiAlertTriangle, FiDollarSign, FiTrendingUp, FiBell } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';

function Dashboard() {
    const {
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getLowStockProducts,
        requestNotificationPermission
    } = useApp();

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        requestNotificationPermission();
    }, [requestNotificationPermission]);

    const handleAddProduct = async (productData) => {
        await addProduct(productData);
    };

    const handleUpdateProduct = async (productData) => {
        if (editingProduct) {
            await updateProduct(editingProduct._id, productData);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteClick = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const lowStockProducts = getLowStockProducts();
    const totalProducts = products.length;
    const totalValue = products.reduce(
        (sum, p) => sum + p.price * p.stockQuantity,
        0
    );
    const outOfStock = products.filter((p) => p.stockQuantity === 0).length;

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'low-stock') return matchesSearch && product.isLowStock;
        if (filter === 'out-of-stock') return matchesSearch && product.stockQuantity === 0;
        return matchesSearch;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            toast.success('Notifications enabled!');
        } else {
            toast.error('Notification permission denied');
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    <FiPackage />
                    Inventory Dashboard
                </h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={handleEnableNotifications}>
                        <FiBell />
                        Enable Alerts
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <FiPlus />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <FiPackage />
                    </div>
                    <div className="stat-value">{totalProducts}</div>
                    <div className="stat-label">Total Products</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon success">
                        <FiDollarSign />
                    </div>
                    <div className="stat-value">{formatCurrency(totalValue)}</div>
                    <div className="stat-label">Inventory Value</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <FiAlertTriangle />
                    </div>
                    <div className="stat-value">{lowStockProducts.length}</div>
                    <div className="stat-label">Low Stock Items</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">
                        <FiTrendingUp />
                    </div>
                    <div className="stat-value">{outOfStock}</div>
                    <div className="stat-label">Out of Stock</div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{ maxWidth: '300px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({products.length})
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'low-stock' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('low-stock')}
                    >
                        Low Stock ({lowStockProducts.length})
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'out-of-stock' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('out-of-stock')}
                    >
                        Out of Stock ({outOfStock})
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <h3 className="empty-state-title">No products found</h3>
                    <p className="empty-state-text">
                        {products.length === 0
                            ? 'Start by adding your first product'
                            : 'No products match your search or filter criteria'}
                    </p>
                    {products.length === 0 && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                            <FiPlus />
                            Add First Product
                        </button>
                    )}
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}

export default Dashboard;
