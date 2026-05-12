import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
            return prev.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prev, { ...product, quantity: 1 }];
        });
    };

    const decreaseQuantity = (id) => {
        setCart((prev) => {
        return prev.map(item => {
            if (item.id === id) {
            if (item.quantity === 1) return null;
            return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }).filter(Boolean);
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};