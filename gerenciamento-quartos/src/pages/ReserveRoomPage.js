import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, updateDoc, arrayUnion, getDocs } from 'firebase/firestore';

const ReserveRoomPage = () => {
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [quartosDisponiveis, setQuartosDisponiveis] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [reservaData, setReservaData] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [textoSelecionado, setTextoSelecionado] = useState('');

  // Carregar lista de clientes disponíveis
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesRef = collection(db, 'clientes');
        const snapshot = await getDocs(clientesRef);
        const clientesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Ordena os clientes por nome em ordem alfabética
        setClientes(clientesData.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchClientes();
  }, []);

   // Filtrar clientes conforme a digitação no campo de busca
   const filteredClientes = clientes.filter(cliente => 
    cliente.name.toLowerCase().includes(filtroCliente.toLowerCase())
  );

    // Atualizar o filtro de cliente conforme o usuário digita
    const handleInputChange = (e) => {
      const text = e.target.value;
      setFiltroCliente(text);
      setTextoSelecionado(text); // Atualiza o estado com o texto digitado
    };

  // Função para buscar quartos disponíveis com base nas datas selecionadas
  const fetchQuartosDisponiveis = async () => {
    setLoading(true);
    try {
      const quartosRef = collection(db, 'quartos');
      const snapshot = await getDocs(quartosRef);
      const quartos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const quartosDisponiveis = quartos.filter(quarto => isQuartoDisponivel(quarto, dataInicio, dataFim));
      setQuartosDisponiveis(quartosDisponiveis);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Verificar se o quarto está disponível para as datas selecionadas
  const isQuartoDisponivel = (quarto, start, end) => {
    const reservas = quarto.reservas || [];
    for (let reserva of reservas) {
      const reservaInicio = reserva.dataInicio.toDate();
      const reservaFim = reserva.dataFim.toDate();
      if (reservaInicio <= new Date(end) && reservaFim >= new Date(start)) {
        return false;
      }
    }
    return true;
  };

  // Função para ajustar a data para meia-noite no horário local
  const adjustDateToLocalMidnight = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };

  // Reservar quarto selecionado com alerta de confirmação
  const handleReservarQuarto = async (quartoId) => {
    try {
      if (!clienteSelecionado) {
        alert('Por favor, selecione um cliente para fazer a reserva.');
        return;
      }
      const reserva = {
        dataInicio: adjustDateToLocalMidnight(dataInicio),
        dataFim: adjustDateToLocalMidnight(dataFim),
        clienteId: clienteSelecionado,
        quartoId: quartoId // Adicione o ID do quarto na reserva
      };
      setReservaData(reserva);
      setShowAlert(true); // Mostrar o alerta de confirmação
    } catch (error) {
      setError(error.message);
      alert(`Erro ao preparar a reserva: ${error.message}`);
    }
  };

  // Confirmar a reserva
  const confirmReserva = async () => {
    try {
      const { quartoId, dataInicio, dataFim, clienteId } = reservaData;
      const quartoRef = doc(db, 'quartos', quartoId);
      await updateDoc(quartoRef, {
        reservas: arrayUnion({
          dataInicio: dataInicio,
          dataFim: dataFim,
          clienteId: clienteId
        }),
        disponibilidade: false
      });
      setShowAlert(false); // Fechar o alerta
      alert('Quarto reservado com sucesso!');
      navigate('/');
    } catch (error) {
      setError(error.message);
      alert(`Erro ao reservar quarto: ${error.message}`);
    }
  };

  // Cancelar a reserva
  const cancelReserva = () => {
    setShowAlert(false);
    setReservaData(null);
  };

  // Submeter o formulário para buscar quartos disponíveis
  const handleSubmit = (e) => {
    e.preventDefault();
    const hoje = new Date();
    const dataInicioSelecionada = new Date(dataInicio);
    const dataFimSelecionada = new Date(dataFim);

    if (dataInicioSelecionada < hoje || dataFimSelecionada < hoje) {
      alert('Não é possível selecionar datas no passado. Por favor, selecione datas válidas.');
      return;
    }

    if (dataInicioSelecionada.getTime() === dataFimSelecionada.getTime()) {
      alert('A data de início não pode ser igual à data de fim. Por favor, selecione datas válidas.');
      return;
    }

    if (dataInicioSelecionada > dataFimSelecionada) {
      alert('A data de início não pode ser posterior à data de fim. Por favor, selecione datas válidas.');
      return;
    }

    if (!dataInicio || !dataFim || !clienteSelecionado) {
      alert('Por favor, selecione as datas de início, fim e um cliente para continuar.');
      return;
    }

    fetchQuartosDisponiveis();
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Reservar Quarto</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Data de Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={styles.input}
            required
          />
          <label>Data de Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={styles.input}
            required
          />
          <label>Cliente:</label>
          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.name} - {cliente.email}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.button}>
            {loading ? 'Carregando...' : 'Buscar Quartos Disponíveis'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        {quartosDisponiveis.length > 0 ? (
          <div style={styles.quartosDisponiveis}>
            <h2>Quartos Disponíveis:</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Descrição</th>
                  <th style={styles.th}>Preço</th>
                  <th style={styles.th}>Amenidades</th>
                  <th style={styles.th}>Imagem</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {quartosDisponiveis.map(quarto => (
                  <tr key={quarto.id}>
                    <td style={styles.td}>{quarto.id}</td>
                    <td style={styles.td}>{quarto.nome}</td>
                    <td style={styles.td}>{quarto.descricao}</td>
                    <td style={styles.td}>R$ {quarto.precoPorNoite.toFixed(2)}</td>
                    <td style={styles.td}>{quarto.amenidades.join(', ')}</td>
                    <td style={styles.td}><img src={quarto.imagemUrl} alt={quarto.nome} style={styles.quartoImage} /></td>
                    <td style={styles.td}>
                      <button onClick={() => handleReservarQuarto(quarto.id)} style={styles.buttonReservar}>
                      Reservar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p>Nenhum quarto disponível para as datas selecionadas.</p>
        )}
      </div>

      {showAlert && (
        <div style={styles.modalContainer}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Confirmar Reserva</h2>
            <p>Data de Início: {reservaData.dataInicio.toLocaleDateString()}</p>
            <p>Data de Fim: {reservaData.dataFim.toLocaleDateString()}</p>
            <div style={styles.modalButtons}>
              <button onClick={confirmReserva} style={styles.modalButtonConfirmar}>Confirmar</button>
              <button onClick={cancelReserva} style={styles.modalButtonCancelar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
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
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '100%',
    maxWidth: '1200px',
  },
  title: {
    marginBottom: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
  },
  quartosDisponiveis: {
    marginTop: '2rem',
    overflowX: 'auto', // Adiciona scroll horizontal caso haja muitos quartos
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  th: {
    padding: '10px',
    backgroundColor: '#f2f2f2',
    color: '#333',
    textAlign: 'center',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
  },
  buttonReservar: {
    padding: '0.5rem',
    fontSize: '0.875rem',
    color: '#fff',
    backgroundColor: '#F15E5E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  quartoImage: {
    maxWidth: '100px',
    maxHeight: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  modalTitle: {
    margin: '0 0 10px 0',
    color: '#333',
  },
  modalButtons: {
    marginTop: '20px',
  },
  modalButtonConfirmar: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  modalButtonCancelar: {
    padding: '10px 20px',
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ReserveRoomPage;
