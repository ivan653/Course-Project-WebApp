import { useState } from 'react';
import ProductsManager from './ProductsManager';
import UsersBookmarks from './UsersBookmarks';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="admin-dashboard-container catalog-container">
        <div className="admin-tabs">
            <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            >
            Управління товарами
            </button>
            <button 
            className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
            >
            Закладки клієнтів
            </button>
        </div>

        <div className="admin-content">
            {activeTab === 'products' ? <ProductsManager /> : <UsersBookmarks />}
        </div>
        </div>
    );
};

export default AdminDashboard;