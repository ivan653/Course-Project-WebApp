import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const productsCol = collection(db, 'products');

// Конвертація файлу зображення у текстовий формат Base64 (щоб не використовувати платний Firebase Storage)
export const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
        resolve(null);
        return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result); // Повертає текстовий рядок з даними картинки
        reader.onerror = (error) => reject(error);
    });
};

// Отримання всіх товарів
export const getProducts = async () => {
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Додавання нового товару
export const addProduct = async (productData) => {
    return await addDoc(productsCol, productData);
};

// Оновлення існуючого товару
export const updateProduct = async (id, updatedData) => {
    const productRef = doc(db, 'products', id);
    return await updateDoc(productRef, updatedData);
};

// Видалення товару
export const deleteProduct = async (id) => {
    const productRef = doc(db, 'products', id);
    return await deleteDoc(productRef);
};