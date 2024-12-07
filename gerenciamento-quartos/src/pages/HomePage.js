import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, limit, where } from 'firebase/firestore';

const HomePage = () => {
  const [clients, setClients] = useState([]);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  useEffect(() => {
    const fetchClients = async () => {
      const db = getFirestore();
      const clientsCollection = collection(db, 'clientes');
      const clientsQuery = query(clientsCollection, orderBy('name'), limit(5));

      try {
        const snapshot = await getDocs(clientsQuery);
        const clientsData = snapshot.docs.map(doc => doc.data().name);
        setClients(clientsData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    const fetchGrowthPercentage = async () => {
      const db = getFirestore();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

      const clientsCollection = collection(db, 'clientes');
      const currentMonthQuery = query(clientsCollection, where('month', '==', currentMonth));

      try {
        const currentMonthSnapshot = await getDocs(currentMonthQuery);
        const currentMonthCount = currentMonthSnapshot.size;

        let lastMonthCount = 0;
        if (lastMonth !== currentMonth) {
          const lastMonthQuery = query(clientsCollection, where('month', '==', lastMonth));
          const lastMonthSnapshot = await getDocs(lastMonthQuery);
          lastMonthCount = lastMonthSnapshot.size;
        }

        const percentage = lastMonthCount === 0 ? 100 : ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
        setGrowthPercentage(percentage.toFixed(2));
      } catch (error) {
        console.error('Erro ao calcular crescimento mensal:', error);
      } finally {
        setLoading(false); // Desativa o estado de carregamento
      }
    };

    fetchClients();
    fetchGrowthPercentage();
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.welcomeTitle}>Olá, Colaborador!</h1>
      <h1 style={styles.welcomeSubtitle}>Acesse o menu lateral para acessar as funções de gerenciamento do sistema</h1>
      <h2 style={styles.dateTitle}>Hoje é dia {getCurrentDate()}</h2>
      <div style={styles.gridContainer}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Últimos 5 clientes cadastrados</h2>
          <div style={styles.cardContent}>
            {loading ? (
              <p>Carregando clientes...</p>
            ) : clients.length > 0 ? (
              <ul style={styles.list}>
                {clients.map((client, index) => (
                  <li key={index} style={styles.listItem}>
                    <p>{client}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum cliente registrado</p>
            )}
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Crescimento Mensal pousada Ypuã</h2>
          <div style={styles.cardContent}>
            {loading ? (
              <p>Calculando crescimento...</p>
            ) : (
              <p style={styles.growthPercentage}>{growthPercentage}%</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  welcomeTitle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '10px',
  },
  welcomeSubtitle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '10px',
  },
  dateTitle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '20px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#F79A87',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    boxSizing: 'border-box',
    color: '#fff',
  },
  cardTitle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '2rem',
    color: '#fff',
    borderBottom: '2px solid #fff',
    paddingBottom: '10px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  cardContent: {
    marginTop: '10px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  growthPercentage: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default HomePage;
