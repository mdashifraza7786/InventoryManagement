import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="app">
                    <OfflineBanner />
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/checkout" element={<Checkout />} />
                        </Routes>
                    </main>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1e293b',
                                color: '#f8fafc',
                                border: '1px solid #334155'
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#f8fafc'
                                }
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#f8fafc'
                                }
                            }
                        }}
                    />
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
