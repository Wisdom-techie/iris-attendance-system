import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { colors, inputStyle, buttonStyle, cardStyle } from '../utils/styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '16px',
    }}>
      <form onSubmit={handleSubmit} className="login-card" style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h2 style={{ margin: 0, color: colors.text }}>Iris Attendance</h2>
          <p style={{ margin: '4px 0 0', color: colors.textMuted, fontSize: '13px' }}>Admin sign in</p>
        </div>

        {error && <div style={{ color: colors.danger, fontSize: '13px' }}>{error}</div>}

        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button style={buttonStyle} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;