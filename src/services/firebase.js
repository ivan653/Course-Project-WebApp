import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAg3m1Ei851EhYKe4wB7R8VsH9AjWSboLk",
    authDomain: "coursework-8ee0f.firebaseapp.com",
    projectId: "coursework-8ee0f",
    storageBucket: "coursework-8ee0f.firebasestorage.app",
    messagingSenderId: "88220493915",
    appId: "1:88220493915:web:a31c646a86bdd74c66377e",
    measurementId: "G-BBEHS9PX12"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експорт екземплярів сервісів для глобального використання
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);