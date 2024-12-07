// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Sidebar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Inicia a sidebar aberta

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const sidebarStyles = {
    width: '220px',
    backgroundColor: '#72B5A4',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: sidebarOpen ? '0' : '-220px',
    transition: '0.3s',
    zIndex: 1000,
    padding: '20px 0', // Adiciona padding no topo e na base da sidebar
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const ulStyles = {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
    marginTop: '20px', // Adiciona espaço acima da lista de links
  };

  const liStyles = {
    marginBottom: '10px',
  };

  const linkStyles = {
    color: '#fff',
    textDecoration: 'none',
    display: 'block',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, color 0.3s',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const logoutStyles = {
    color: '#fff',
    textDecoration: 'none',
    display: 'block',
    fontWeight: 'bold',
    backgroundColor: '#595757',
    padding: '24px',
    textAlign: 'center',
    borderRadius: '8px',
    marginTop: 'auto', // Coloca o link de logout na parte inferior
    width: '50%', // Largura ajustada para o conteúdo do botão
    marginBottom: '45px', // Espaçamento abaixo do botão
  };

  const toggleButtonStyles = {
    position: 'fixed',
    top: '20px',
    left: sidebarOpen ? '240px' : '20px',
    width: '30px',
    height: '25px',
    display: 'flex',
    transition: '0.3s',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1001,
    transform: sidebarOpen ? 'rotate(180deg)' : 'none', // Rotação para formar o 'X'
  };

  const lineStyles = {
    width: '100%',
    height: '3px',
    backgroundColor: '#F15E5E',
    borderRadius: '2px',
    transition: 'transform 0.3s', // Adiciona transição suave para a rotação
  };

  const diagonalLineStyles = {
    transform: sidebarOpen ? 'rotate(45deg) translate(1px, 1px)' : 'rotate(0)',
  };

  const antiDiagonalLineStyles = {
    transform: sidebarOpen ? 'rotate(-45deg) translate(-1px, 1px)' : 'rotate(0)',
  };

  return (
    <>
      <div style={sidebarStyles}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Pousada Ypuã</h2>
        <ul style={ulStyles}>
          <li style={liStyles}><Link to="/home" style={linkStyles} className="sidebar-link">Dashboard</Link></li>
          <li style={liStyles}><Link to="/rooms" style={linkStyles} className="sidebar-link">Gerenciar Quartos</Link></li>
          <li style={liStyles}><Link to="/reserve-room" style={linkStyles} className="sidebar-link">Reservar quarto</Link></li>
          <li style={liStyles}><Link to="/create-room" style={linkStyles} className="sidebar-link">Adicionar quarto</Link></li>
          <li style={liStyles}><Link to="/register-client" style={linkStyles} className="sidebar-link">Cadastrar Cliente</Link></li>
          <li style={liStyles}><Link to="/client-list" style={linkStyles} className="sidebar-link">Lista de Clientes</Link></li>
          {/* Adicionar mais links conforme necessário */}
        </ul>
        <Link to="#" style={logoutStyles} onClick={handleLogout}>Sair</Link>
      </div>
      <div onClick={toggleSidebar} style={toggleButtonStyles}>
        <div style={{ ...lineStyles, ...diagonalLineStyles }}></div>
        <div style={{ ...lineStyles, opacity: sidebarOpen ? 0 : 1 }}></div>
        <div style={{ ...lineStyles, ...antiDiagonalLineStyles }}></div>
      </div>
      <style>
        {`
          .sidebar-link:hover {
            background-color: #FFB4A9;
            color: #333;
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;
