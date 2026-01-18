import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

function CheckoutItem({ item, onUpdateQuantity, onRemove }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const subtotal = item.product.price * item.quantity;

    return (
        <div className="cart-item">
            <div className="cart-item-info">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-price">
                    {formatCurrency(item.product.price)} each
                </div>
            </div>
            <div className="cart-item-controls">
                <div className="quantity-control">
                    <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                    >
                        <FiMinus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                    >
                        <FiPlus size={16} />
                    </button>
                </div>
                <div className="cart-item-subtotal">{formatCurrency(subtotal)}</div>
                <button
                    className="cart-item-remove"
                    onClick={() => onRemove(item.product._id)}
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default CheckoutItem;
