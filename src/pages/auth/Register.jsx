import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
        // За замовчуванням всі нові акаунти отримують роль 'client'
        await registerUser(email, password, 'client');
        navigate('/');
        } catch (err) {
        setError('Помилка реєстрації. Можливо, пароль надто короткий або email вже існує.');
        }
    };

    return (
        <div className="auth-container">
        <h2>Реєстрація</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
            <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            />
            <input 
            type="password" 
            placeholder="Пароль (мінімум 6 символів)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            />
            <button type="submit">Зареєструватися</button>
        </form>
        </div>
    );
};

export default Register;