import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getProducts } from '../../services/dbService';

const UsersBookmarks = () => {
    const [usersData, setUsersData] = useState([]);
    const [productsMap, setProductsMap] = useState({});

    useEffect(() => {
        const fetchData = async () => {
        // 1. Отримуємо всіх користувачів із роллю 'client'
        const q = query(collection(db, 'users'), where('role', '==', 'client'));
        const usersSnap = await getDocs(q);
        const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 2. Отримуємо всі товари для створення словника { id: "Назва товару" }
        const products = await getProducts();
        const pMap = {};
        products.forEach(p => pMap[p.id] = p.name);
        
        setProductsMap(pMap);
        setUsersData(users);
        };
        fetchData();
    }, []);

    return (
        <div className="admin-products-container" style={{ marginTop: '40px' }}>
        <h2>Закладки клієнтів</h2>
        <div className="admin-products-list">
            {usersData.map(user => (
            <div key={user.id} className="admin-product-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                <strong>Email клієнта: {user.email}</strong>
                <p>
                Закладки: {
                    user.bookmarks && user.bookmarks.length > 0 
                    ? user.bookmarks.map(id => productsMap[id] || 'Невідомий товар').join(', ') 
                    : 'Немає закладок'
                }
                </p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default UsersBookmarks;