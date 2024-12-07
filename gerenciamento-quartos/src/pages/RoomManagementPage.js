import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const RoomManagementPage = () => {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuartos = async () => {
      setLoading(true);
      try {
        const quartosRef = collection(db, 'quartos');
        const snapshot = await getDocs(quartosRef);
        const quartosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuartos(quartosData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuartos();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Carregando quartos...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gerenciamento de Quartos</h1>
      {quartos.length === 0 ? (
        <p style={styles.emptyMessage}>Nenhum quarto encontrado.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Descrição</th>
                <th style={styles.th}>Preço por Noite</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {quartos.map(quarto => (
                <tr key={quarto.id} style={styles.tr}>
                  <td style={styles.td}>{quarto.id}</td>
                  <td style={styles.td}>{quarto.nome}</td>
                  <td style={styles.td}>{quarto.descricao}</td>
                  <td style={styles.td}>R$ {quarto.precoPorNoite.toFixed(2)}</td>
                  <td style={styles.td}>
                    <Link to={`/room-detail/${quarto.id}`} style={styles.link}>
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginTop: '100px',
    marginBottom: '50px',
    color: '#595757',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '20px',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
    marginTop: '20px',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    padding: '20px',
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  th: {
    padding: '12px',
    backgroundColor: '#72B5A4',
    color: '#333',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
  },
  tr: {
    backgroundColor: '#fff',
    '&:nth-of-type(even)': {
      backgroundColor: '#f9f9f9',
    },
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  link: {
    textDecoration: 'none',
    color: '#72B5A4',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default RoomManagementPage;