import React, { useState } from 'react';
import {
    FiShoppingCart,
    FiSearch,
    FiShoppingBag,
    FiDollarSign,
    FiCreditCard,
    FiSmartphone
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import CheckoutItem from '../components/CheckoutItem';

function Checkout() {
    const {
        products,
        cart,
        loading,
        isOnline,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        completeSale
    } = useApp();

    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCompleteSale = async () => {
        if (!isOnline) {
            return;
        }
        setProcessing(true);
        try {
            await completeSale(paymentMethod);
        } catch (error) {
            console.error('Sale failed:', error);
        } finally {
            setProcessing(false);
        }
    };

    const cartTotal = getCartTotal();
    const taxAmount = cartTotal * 0.18;
    const grandTotal = cartTotal + taxAmount;

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
                    <FiShoppingCart />
                    Checkout
                </h1>
            </div>

            <div className="checkout-container">
                <div className="checkout-products">
                    <div className="checkout-products-header">
                        <h3>Select Products</h3>
                        <div className="search-input">
                            <FiSearch className="icon" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No products found
                        </div>
                    ) : (
                        <div className="checkout-product-list">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className={`checkout-product-item ${product.stockQuantity === 0 ? 'disabled' : ''}`}
                                    onClick={() => product.stockQuantity > 0 && addToCart(product)}
                                >
                                    <div className="checkout-product-name">{product.name}</div>
                                    <div className="checkout-product-price">
                                        {formatCurrency(product.price)}
                                    </div>
                                    <div className={`checkout-product-stock ${product.isLowStock ? 'low' : ''}`}>
                                        {product.stockQuantity === 0
                                            ? 'Out of Stock'
                                            : `${product.stockQuantity} in stock`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="cart-section">
                    <h3 className="cart-title">
                        <FiShoppingBag />
                        Cart ({cart.length} items)
                    </h3>

                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <p>Your cart is empty</p>
                            <p style={{ fontSize: '13px', marginTop: '8px' }}>
                                Click on products to add them
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <CheckoutItem
                                        key={item.product._id}
                                        item={item}
                                        onUpdateQuantity={updateCartQuantity}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="cart-summary-row">
                                    <span className="cart-summary-label">Subtotal</span>
                                    <span className="cart-summary-value">{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="cart-summary-row">
                                    <span className="cart-summary-label">Tax (18% GST)</span>
                                    <span className="cart-summary-value">{formatCurrency(taxAmount)}</span>
                                </div>
                                <div className="cart-summary-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                    <span className="cart-summary-label" style={{ fontSize: '18px', fontWeight: '600' }}>
                                        Total
                                    </span>
                                    <span className="cart-total">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label className="form-label">Payment Method</label>
                                <div className="payment-methods">
                                    <div
                                        className={`payment-method ${paymentMethod === 'cash' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <div className="payment-method-icon">
                                            <FiDollarSign />
                                        </div>
                                        <div className="payment-method-label">Cash</div>
                                    </div>
                                    <div
                                        className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="payment-method-icon">
                                            <FiCreditCard />
                                        </div>
                                        <div className="payment-method-label">Card</div>
                                    </div>
                                    <div
                                        className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('upi')}
                                    >
                                        <div className="payment-method-icon">
                                            <FiSmartphone />
                                        </div>
                                        <div className="payment-method-label">UPI</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={clearCart}
                                    style={{ flex: 1 }}
                                >
                                    Clear Cart
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleCompleteSale}
                                    disabled={processing || !isOnline}
                                    style={{ flex: 2 }}
                                >
                                    {processing ? 'Processing...' : !isOnline ? 'Offline' : 'Complete Sale'}
                                </button>
                            </div>

                            {!isOnline && (
                                <p style={{
                                    color: 'var(--accent-warning)',
                                    fontSize: '13px',
                                    textAlign: 'center',
                                    marginTop: '12px'
                                }}>
                                    Sales cannot be completed while offline
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;
