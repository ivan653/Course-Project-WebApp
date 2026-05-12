import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage } from '../../services/dbService';

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', tags: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Якщо ми редагуємо, спочатку беремо старе посилання на зображення
        let imageUrl = editId ? products.find(p => p.id === editId)?.imageUrl : null;
        
        // Якщо обрано новий файл, завантажуємо його і отримуємо нове посилання
        if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        }

        const productData = {
        name: form.name,
        price: Number(form.price),
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        imageUrl: imageUrl || null
        };

        if (editId) {
        await updateProduct(editId, productData);
        setEditId(null);
        } else {
        await addProduct(productData);
        }
        
        // Очищення форми
        setForm({ name: '', price: '', tags: '' });
        setImageFile(null);
        document.getElementById('image-upload').value = ''; // Скидаємо інпут файлу
        
        fetchProducts();
        setLoading(false);
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setForm({ 
        name: product.name, 
        price: product.price, 
        tags: product.tags ? product.tags.join(', ') : '' 
        });
        setImageFile(null); 
        document.getElementById('image-upload').value = ''; 
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({ name: '', price: '', tags: '' });
        setImageFile(null);
        document.getElementById('image-upload').value = '';
    };

    const handleDelete = async (id) => {
        if (window.confirm('Видалити цей товар?')) {
        await deleteProduct(id);
        fetchProducts();
        }
    };

    return (
        <div className="admin-products-container">
        <form onSubmit={handleSubmit} className="product-form">
            <input 
            type="text" 
            placeholder="Назва товару" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            required 
            />
            <input 
            type="number" 
            placeholder="Ціна" 
            value={form.price} 
            onChange={(e) => setForm({...form, price: e.target.value})} 
            required 
            />
            <input 
            type="text" 
            placeholder="Теги (через кому)" 
            value={form.tags} 
            onChange={(e) => setForm({...form, tags: e.target.value})} 
            />
            <input 
            id="image-upload"
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])} 
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading}>
                {loading ? 'Збереження...' : (editId ? 'Оновити' : 'Додати')}
            </button>
            
            {editId && (
                <button 
                type="button" 
                onClick={handleCancelEdit} 
                style={{ backgroundColor: '#95a5a6' }}
                >
                Скасувати
                </button>
            )}
            </div>
        </form>

        <div className="admin-products-list">
            {products.map(product => (
            <div key={product.id} className="admin-product-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {product.imageUrl && (
                    <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                )}
                <span>{product.name} - {product.price} грн ({product.tags?.join(', ') || 'без тегів'})</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={() => handleEdit(product)} 
                    style={{ backgroundColor: '#f39c12' }}
                >
                    Редагувати
                </button>
                <button onClick={() => handleDelete(product.id)}>Видалити</button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ProductsManager;