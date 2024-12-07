import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const RegisterClientPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'clientes'), {
        cpf,
        name,
        email,
      });
      alert('Cliente cadastrado com sucesso!');
      navigate(0); // Recarrega a página
    } catch (error) {
      setError(error.message);
      alert(`Erro ao cadastrar cliente: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Cadastro de Cliente</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            <p style={styles.labelText}>Nome Completo</p>
            <input
              type="text"
              placeholder="Digite Seu Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            <p style={styles.labelText}>CPF</p>
            <input
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            <p style={styles.labelText}>Email</p>
            <input
              type="email"
              placeholder="Digite Seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Carregando...' : 'Cadastrar'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

// Estilos inline para a página de cadastro de clientes
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    margin: '48px',
    padding: '32px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    maxWidth: '90%',
  },
  title: {
    marginBottom: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    width: '100%',
    marginBottom: '1rem',
  },
  labelText: {
    marginBottom: '0.5rem',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
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
    textAlign: 'center',
  },
};

export default RegisterClientPage;
