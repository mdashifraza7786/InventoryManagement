import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productAPI, saleAPI } from '../services/api';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success('Back online!');
            fetchProducts();
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error('You are offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await productAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            if (!error.isOffline) {
                toast.error('Failed to fetch products');
            }
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addProduct = async (productData) => {
        try {
            const response = await productAPI.create(productData);
            setProducts((prev) => [response.data, ...prev]);
            toast.success('Product added successfully');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add product';
            toast.error(message);
            throw error;
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const response = await productAPI.update(id, productData);
            setProducts((prev) =>
                prev.map((product) => (product._id === id ? response.data : product))
            );
            toast.success('Product updated successfully');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update product';
            toast.error(message);
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productAPI.delete(id);
            setProducts((prev) => prev.filter((product) => product._id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete product';
            toast.error(message);
            throw error;
        }
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product._id === product._id);
            if (existing) {
                if (existing.quantity >= product.stockQuantity) {
                    toast.error('Cannot add more than available stock');
                    return prev;
                }
                return prev.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            if (product.stockQuantity < 1) {
                toast.error('Product is out of stock');
                return prev;
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) => {
                if (item.product._id === productId) {
                    if (quantity > item.product.stockQuantity) {
                        toast.error('Cannot exceed available stock');
                        return item;
                    }
                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.product._id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const completeSale = async (paymentMethod) => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return null;
        }

        try {
            const saleData = {
                items: cart.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity
                })),
                paymentMethod
            };

            const response = await saleAPI.create(saleData);

            if (response.data.lowStockAlerts && response.data.lowStockAlerts.length > 0) {
                response.data.lowStockAlerts.forEach((alert) => {
                    toast.error(`⚠️ Low Stock: ${alert.productName} (${alert.currentStock} left)`, {
                        duration: 6000
                    });

                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('Low Stock Alert', {
                            body: `${alert.productName} has only ${alert.currentStock} items left!`,
                            icon: '/icons/icon-192.png',
                            tag: `low-stock-${alert.productId}`
                        });
                    }
                });
            }

            await fetchProducts();
            clearCart();
            toast.success('Sale completed successfully!');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to complete sale';
            toast.error(message);
            throw error;
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    };

    const getLowStockProducts = () => {
        return products.filter((product) => product.isLowStock);
    };

    const value = {
        products,
        cart,
        loading,
        isOnline,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        completeSale,
        requestNotificationPermission,
        getLowStockProducts
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
