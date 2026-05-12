import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Захист маршрутів: перевірка наявності авторизації та відповідності ролі
const PrivateRoute = ({ requiredRole }) => {
    const { user, role, loading } = useAuth();

    if (loading) return <div>Завантаження...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default PrivateRoute;