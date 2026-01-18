import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiGrid, FiCloud, FiCloudOff } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

function Navbar() {
    const location = useLocation();
    const { getCartItemCount, getLowStockProducts, pendingSalesCount, isOnline } = useApp();
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
                    {pendingSalesCount > 0 && (
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#f59e0b',
                            color: '#1a1a1a',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            marginLeft: '8px'
                        }}>
                            <FiCloudOff size={12} />
                            {pendingSalesCount} pending
                        </span>
                    )}
                </Link>
                <div className="navbar-nav">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isOnline ? '#10b981' : '#ef4444',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}>
                        {isOnline ? <FiCloud size={14} /> : <FiCloudOff size={14} />}
                        {isOnline ? 'Online' : 'Offline'}
                    </div>
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
