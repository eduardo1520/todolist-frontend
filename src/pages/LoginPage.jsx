import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/signin', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/'); 
    } catch (err) {
      setError('Acesso negado. Verifique seu usuário e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>Todo<span>List</span></h1>
          <p style={styles.subtitle}>Gerencie seus projetos em um só lugar.</p>
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <div style={styles.errorBanner}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
        <div style={styles.footer}>
          <span>Novo por aqui?</span>
          <Link to="/register" style={styles.link}>Criar conta gratuita</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f7f9',
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  header: { marginBottom: '32px' },
  logo: { 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#1a202c', 
    margin: 0,
    letterSpacing: '-1px'
  },
  subtitle: { color: '#718096', fontSize: '14px', marginTop: '8px' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4c51bf',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.2s',
  },
  errorBanner: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '15px',
    border: '1px solid #feb2b2',
  },
  footer: { marginTop: '24px', fontSize: '14px', color: '#718096' },
  link: { color: '#4c51bf', fontWeight: '600', textDecoration: 'none', marginLeft: '5px' }
};

export default LoginPage;