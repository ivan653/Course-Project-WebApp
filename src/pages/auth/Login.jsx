import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

// Компонент форми входу
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        await loginUser(email, password);
        navigate('/');
        } catch (err) {
        setError('Помилка входу. Перевірте дані.');
        }
    };

    return (
        <div className="auth-container">
        <h2>Вхід в систему</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
            <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            />
            <input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            />
            <button type="submit">Увійти</button>
        </form>
        </div>
    );
};

export default Login;