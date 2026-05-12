import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/authService';
import './Navbar.scss'; 

const Navbar = () => {
    const { user, role } = useAuth();

    return (
        <nav className="navbar">
        <div className="navbar-logo">
            <Link to="/">GroceryStore</Link>
        </div>
        <div className="navbar-links">
            <Link to="/">Каталог</Link>
            
            {user && role === 'client' && (
            <>
                <Link to="/favorites">Закладки</Link>
                <Link to="/cart">Кошик</Link>
            </>
            )}

            {role === 'admin' && (
            <Link to="/admin">Адмін-панель</Link>
            )}

            {!user ? (
            <div className="auth-links">
                <Link to="/login">Увійти</Link>
                <span style={{ margin: '0 10px' }}></span>
                <Link to="/register">Реєстрація</Link>
            </div>
            ) : (
            <div className="user-profile">
                <span className="user-email">{user.email}</span>
                <button onClick={logoutUser} className="logout-btn">Вийти</button>
            </div>
            )}
        </div>
        </nav>
    );
};

export default Navbar;