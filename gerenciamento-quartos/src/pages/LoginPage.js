import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Inicia o estado de carregamento

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento, independentemente do resultado
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Área o funcionário</h1>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.input}
            required
          />
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="Digite sua senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
      <div>
      <h2 style={styles.title}>Caso não tenha suas credenciais, solicite para seu administrador</h2>
      </div>
    </div>
  );
};

// Estilos inline para a página de login
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#F79A87',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    margin: '48px',
    padding: '64px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  form: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#72B5A4',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '0.5rem',
  },
};

export default LoginPage;
