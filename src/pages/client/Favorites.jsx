import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { getProducts } from '../../services/dbService';
import { CartContext } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { user } = useAuth();
    const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
        if (!user) return;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const bookmarkIds = userDoc.exists() ? userDoc.data().bookmarks || [] : [];
        
        const allProducts = await getProducts();
        setFavorites(allProducts.filter(p => bookmarkIds.includes(p.id)));
        setLoading(false);
        };
        loadFavorites();
    }, [user]);

    const removeBookmark = async (productId) => {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { bookmarks: arrayRemove(productId) });
        setFavorites(prev => prev.filter(p => p.id !== productId));
    };

    // Допоміжна функція для перевірки кількості товару в кошику
    const getQuantityInCart = (productId) => {
        const item = cart.find(c => c.id === productId);
        return item ? item.quantity : 0;
    };

    if (loading) {
        return <div className="catalog-container" style={{ textAlign: 'center', padding: '100px 20px' }}>Завантаження...</div>;
    }

    // Відображення, якщо закладки порожні
    if (favorites.length === 0) {
        return (
        <div className="catalog-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Ваші закладки порожні ♡</h2>
            <p style={{ color: '#6B7280', marginBottom: '30px' }}>Ви ще не додали сюди жодного улюбленого товару.</p>
            <Link to="/">
            <button className="btn-cart">Перейти до каталогу</button>
            </Link>
        </div>
        );
    }

    return (
        <div className="catalog-container">
        <h2>Мої закладки</h2>
        
        <div className="products-grid" style={{ marginTop: '30px' }}>
            {favorites.map(product => {
            const quantity = getQuantityInCart(product.id);

            return (
                <div key={product.id} className="product-card">
                {/* Блок із зображенням */}
                <div className="image-wrapper">
                    {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    ) : (
                    <div className="product-image-placeholder">Фото відсутнє</div>
                    )}
                </div>
                
                {/* Блок з інформацією про товар */}
                <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">{product.price} грн</p>
                    <div className="tags">
                    {product.tags?.length > 0 
                        ? product.tags.map(tag => <span key={tag} className="tag-badge">{tag}</span>) 
                        : <span className="tag-badge empty">Без тегів</span>
                    }
                    </div>
                </div>

                {/* Блок з кнопками дій */}
                <div className="card-actions">
                    {/* Додавання в кошик прямо із закладок */}
                    {quantity > 0 ? (
                    <div className="quantity-controls in-card">
                        <button onClick={() => decreaseQuantity(product.id)}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => addToCart(product)}>+</button>
                    </div>
                    ) : (
                    <button className="btn-cart" onClick={() => addToCart(product)}>У кошик</button>
                    )}
                    
                    {/* Кнопка видалення із закладок (стилізована під активну кнопку) */}
                    <button 
                    className="btn-bookmark active" 
                    onClick={() => removeBookmark(product.id)}
                    title="Видалити з закладок"
                    >
                    Видалити ✕
                    </button>
                </div>
                </div>
            );
            })}
        </div>
        </div>
    );
};

export default Favorites;