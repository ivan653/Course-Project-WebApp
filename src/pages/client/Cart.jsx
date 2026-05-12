import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
        <div className="catalog-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Ваш кошик порожній 🛒</h2>
            <p style={{ color: '#6B7280', marginBottom: '30px' }}>Ви ще не додали жодного товару.</p>
            <Link to="/">
            <button className="btn-cart">Перейти до каталогу</button>
            </Link>
        </div>
        );
    }

    return (
        <div className="catalog-container cart-page-container">
        <h2>Оформлення замовлення</h2>
        
        <div className="cart-layout">
            <div className="cart-items-list">
            {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                    {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                    ) : (
                    <div className="placeholder">Немає фото</div>
                    )}
                </div>
                
                <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="price-per-unit">{item.price} грн / шт.</p>
                </div>

                <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                </div>

                <div className="cart-item-subtotal">
                    <strong>{item.price * item.quantity} грн</strong>
                </div>

                <button className="btn-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
            ))}
            </div>

            <div className="cart-summary">
            <h3>Підсумок</h3>
            <div className="summary-row">
                <span>Всього товарів:</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
            </div>
            <div className="summary-row total">
                <span>До сплати:</span>
                <span>{total} грн</span>
            </div>
            <button className="btn-checkout">Оформити замовлення</button>
            </div>
        </div>
        </div>
    );
};

export default Cart;