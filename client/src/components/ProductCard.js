import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

function ProductCard({ product, onEdit, onDelete }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className={`product-card ${product.isLowStock ? 'low-stock' : ''}`}>
            {product.isLowStock && (
                <span className="low-stock-badge">Low Stock</span>
            )}
            <span className="product-category">{product.category}</span>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-sku">SKU: {product.sku}</p>
            <div className="product-details">
                <div className="product-detail">
                    <div className="product-detail-label">Price</div>
                    <div className="product-detail-value" style={{ color: '#10b981' }}>
                        {formatCurrency(product.price)}
                    </div>
                </div>
                <div className="product-detail">
                    <div className="product-detail-label">Stock</div>
                    <div
                        className="product-detail-value"
                        style={{ color: product.isLowStock ? '#ef4444' : '#f8fafc' }}
                    >
                        {product.stockQuantity}
                    </div>
                </div>
                <div className="product-detail">
                    <div className="product-detail-label">Threshold</div>
                    <div className="product-detail-value">{product.lowStockThreshold}</div>
                </div>
                <div className="product-detail">
                    <div className="product-detail-label">Status</div>
                    <div
                        className="product-detail-value"
                        style={{
                            color: product.stockQuantity === 0
                                ? '#ef4444'
                                : product.isLowStock
                                    ? '#f59e0b'
                                    : '#10b981'
                        }}
                    >
                        {product.stockQuantity === 0
                            ? 'Out of Stock'
                            : product.isLowStock
                                ? 'Low Stock'
                                : 'In Stock'}
                    </div>
                </div>
            </div>
            <div className="product-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(product)}>
                    <FiEdit2 size={16} />
                    Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(product._id)}>
                    <FiTrash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
