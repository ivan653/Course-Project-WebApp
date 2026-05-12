import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Управління автентифікацією та створення профілю з ролями
export const registerUser = async (email, password, role = 'client') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Зберігаємо додаткові дані користувача у Firestore
    await setDoc(doc(db, 'users', user.uid), { 
        email,
        role,
        bookmarks: []
    });
    
    return user;
};

export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return await signOut(auth);
};