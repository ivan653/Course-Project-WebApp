import { useState, useEffect, useContext } from 'react';
import { getProducts } from '../../services/dbService';
import { CartContext } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [sortType, setSortType] = useState('name');
    const [selectedTag, setSelectedTag] = useState('all');
    const [userBookmarks, setUserBookmarks] = useState([]);

    const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!user) {
        setUserBookmarks([]);
        return;
        }
        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists()) {
            setUserBookmarks(docSnap.data().bookmarks || []);
        }
        });
        return () => unsubscribe();
    }, [user]);

    const toggleBookmark = async (productId) => {
        if (!user) return alert('Увійдіть для додавання в закладки');
        
        const isBookmarked = userBookmarks.includes(productId);
        const userRef = doc(db, 'users', user.uid);
        
        await updateDoc(userRef, {
        bookmarks: isBookmarked ? arrayRemove(productId) : arrayUnion(productId)
        });
    };

    const uniqueTags = ['all', ...new Set(products.flatMap(p => p.tags || []))];

    const filteredAndSortedProducts = products
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .filter(p => selectedTag === 'all' || p.tags?.includes(selectedTag))
        .sort((a, b) => {
        if (sortType === 'priceAsc') return a.price - b.price;
        if (sortType === 'priceDesc') return b.price - a.price;
        return a.name.localeCompare(b.name);
        });

    // Допоміжна функція для отримання кількості конкретного товару в кошику
    const getQuantityInCart = (productId) => {
        const item = cart.find(c => c.id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="catalog-container">
        <div className="controls">
            <div className="search-wrapper">
            <input 
                type="text" 
                placeholder="Пошук товарів..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            </div>
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="name">За назвою</option>
            <option value="priceAsc">Від дешевих до дорогих</option>
            <option value="priceDesc">Від дорогих до дешевих</option>
            </select>
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            {uniqueTags.map(tag => (
                <option key={tag} value={tag}>
                {tag === 'all' ? 'Всі категорії' : tag}
                </option>
            ))}
            </select>
        </div>

        <div className="products-grid">
            {filteredAndSortedProducts.map(product => {
            const isBookmarked = userBookmarks.includes(product.id);
            const quantity = getQuantityInCart(product.id);
            
            return (
                <div key={product.id} className="product-card">
                <div className="image-wrapper">
                    {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    ) : (
                    <div className="product-image-placeholder">Фото відсутнє</div>
                    )}
                </div>
                
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

                <div className="card-actions">
                    {/* Якщо товар вже в кошику, показуємо контролери + / -, інакше кнопку "У кошик" */}
                    {quantity > 0 ? (
                    <div className="quantity-controls in-card">
                        <button onClick={() => decreaseQuantity(product.id)}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => addToCart(product)}>+</button>
                    </div>
                    ) : (
                    <button className="btn-cart" onClick={() => addToCart(product)}>У кошик</button>
                    )}
                    
                    <button 
                    className={`btn-bookmark ${isBookmarked ? 'active' : ''}`} 
                    onClick={() => toggleBookmark(product.id)}
                    >
                    {isBookmarked ? 'В закладках ♥' : 'В закладки ♡'}
                    </button>
                </div>
                </div>
            );
            })}
        </div>
        </div>
    );
};

export default Home;