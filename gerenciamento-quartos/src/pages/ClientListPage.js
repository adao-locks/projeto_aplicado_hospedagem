import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const ClientListPage = () => {
  // Estado para armazenar a lista de clientes
  const [clients, setClients] = useState([]);
  // Estado para controlar o carregamento dos dados
  const [loading, setLoading] = useState(true);
  // Estado para armazenar o cliente sendo editado
  const [editClient, setEditClient] = useState(null);
  // Estado para armazenar os valores dos campos de edição
  const [editValues, setEditValues] = useState({ name: '', cpf: '', email: '' });

  // Efeito colateral para buscar clientes quando o componente é montado
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Obtém todos os documentos da coleção 'clientes'
        const querySnapshot = await getDocs(collection(db, 'clientes'));
        // Mapeia os documentos para um formato utilizável
        const clientsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsList);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []); // Dependência vazia para executar apenas na montagem

  // Função para lidar com a exclusão de um cliente
  const handleDelete = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${name}?`)) {
      try {
        // Remove o documento da coleção 'clientes'
        await deleteDoc(doc(db, 'clientes', id));
        // Atualiza a lista de clientes após a exclusão
        setClients(clients.filter((client) => client.id !== id));
        alert('Cliente removido com sucesso!');
      } catch (error) {
        alert(`Erro ao remover cliente: ${error.message}`);
      }
    }
  };

  // Função para iniciar o processo de edição
  const handleEdit = (client) => {
    setEditClient(client);
    // Preenche os campos de edição com os valores atuais do cliente
    setEditValues({ name: client.name, cpf: client.cpf, email: client.email });
  };

  // Função para salvar as alterações no cliente
  const handleSave = async () => {
    try {
      // Referência ao documento do cliente a ser atualizado
      const clientRef = doc(db, 'clientes', editClient.id);
      // Atualiza os dados do cliente
      await updateDoc(clientRef, {
        name: editValues.name,
        cpf: editValues.cpf,
        email: editValues.email,
      });
      // Atualiza a lista de clientes com os novos valores
      setClients(clients.map((client) => 
        client.id === editClient.id ? { ...client, ...editValues } : client
      ));
      setEditClient(null);
      alert('Cliente atualizado com sucesso!');
    } catch (error) {
      alert(`Erro ao atualizar cliente: ${error.message}`);
    }
  };

  // Exibição condicional enquanto os dados estão carregando
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lista de Clientes</h1>
      {/* Formulário de edição exibido quando um cliente está sendo editado */}
      {editClient ? (
        <div style={styles.editForm}>
          <h2>Editar Cliente</h2>
          <input 
            type="text" 
            placeholder="Nome" 
            value={editValues.name} 
            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} 
            style={styles.input}
          />
          <input 
            type="text" 
            placeholder="CPF" 
            value={editValues.cpf} 
            onChange={(e) => setEditValues({ ...editValues, cpf: e.target.value })} 
            style={styles.input}
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={editValues.email} 
            onChange={(e) => setEditValues({ ...editValues, email: e.target.value })} 
            style={styles.input}
          />
          <button onClick={handleSave} style={styles.saveButton}>Salvar</button>
          <button onClick={() => setEditClient(null)} style={styles.cancelButton}>Cancelar</button>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>CPF</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Renderiza a lista de clientes */}
            {clients.map((client) => (
              <tr key={client.id} style={styles.row}>
                <td style={styles.td}>{client.name}</td>
                <td style={styles.td}>{client.cpf}</td>
                <td style={styles.td}>{client.email}</td>
                <td style={styles.td}>
                  {/* Botões de ação para editar e excluir clientes */}
                  <button style={styles.editButton} onClick={() => handleEdit(client)}>Editar</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(client.id, client.name)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Estilos para o componente
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#72B5A4',
    color: '#333',
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
  },
  row: {
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  editButton: {
    backgroundColor: '#72B5A4',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  editForm: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default ClientListPage;
