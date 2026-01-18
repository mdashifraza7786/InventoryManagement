import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

function ProductForm({ product, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        stockQuantity: '',
        lowStockThreshold: '10'
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                category: product.category || '',
                price: product.price?.toString() || '',
                stockQuantity: product.stockQuantity?.toString() || '',
                lowStockThreshold: product.lowStockThreshold?.toString() || '10'
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.price || parseFloat(formData.price) < 0) {
            newErrors.price = 'Valid price is required';
        }
        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Valid stock quantity is required';
        }
        if (!formData.lowStockThreshold || parseInt(formData.lowStockThreshold) < 0) {
            newErrors.lowStockThreshold = 'Valid threshold is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                name: formData.name.trim(),
                sku: formData.sku.trim(),
                category: formData.category.trim(),
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                lowStockThreshold: parseInt(formData.lowStockThreshold)
            });
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter product name"
                            />
                            {errors.name && (
                                <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.name}</span>
                            )}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., PRD-001"
                                />
                                {errors.sku && (
                                    <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.sku}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Electronics"
                                />
                                {errors.category && (
                                    <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.category}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                {errors.price && (
                                    <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.price}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.stockQuantity && (
                                    <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.stockQuantity}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Low Stock Threshold</label>
                            <input
                                type="number"
                                name="lowStockThreshold"
                                value={formData.lowStockThreshold}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="10"
                                min="0"
                            />
                            {errors.lowStockThreshold && (
                                <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.lowStockThreshold}</span>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
