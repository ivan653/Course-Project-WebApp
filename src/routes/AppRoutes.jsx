import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Navbar from '../components/layout/Navbar';

import Home from '../pages/client/Home';
import Cart from '../pages/client/Cart';
import Favorites from '../pages/client/Favorites';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductsManager from '../pages/admin/ProductsManager';
import UsersBookmarks from '../pages/admin/UsersBookmarks';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRoutes = () => {
    return (
        <>
        <Navbar /> {/* Відображається на всіх сторінках */}
        
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Приватні маршрути для клієнтів (якщо роль admin, вони теж не зайдуть сюди) */}
            <Route element={<PrivateRoute requiredRole="client" />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            </Route>

            {/* Приватні маршрути для адміністраторів */}
            <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin" element={
                <>
                <AdminDashboard />
                </>
            } />
            </Route>
        </Routes>
        </>
    );
    };

export default AppRoutes;