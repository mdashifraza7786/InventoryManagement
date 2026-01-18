import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiGrid } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

function Navbar() {
    const location = useLocation();
    const { getCartItemCount, getLowStockProducts } = useApp();
    const cartCount = getCartItemCount();
    const lowStockCount = getLowStockProducts().length;

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <FiPackage />
                    </div>
                    <span className="navbar-title">InvBilling</span>
                </Link>
                <div className="navbar-nav">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        <FiGrid />
                        <span>Dashboard</span>
                        {lowStockCount > 0 && (
                            <span style={{
                                background: '#ef4444',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '700'
                            }}>
                                {lowStockCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/checkout"
                        className={`nav-link ${location.pathname === '/checkout' ? 'active' : ''}`}
                    >
                        <FiShoppingCart />
                        <span>Checkout</span>
                        {cartCount > 0 && (
                            <span style={{
                                background: '#10b981',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '700'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
