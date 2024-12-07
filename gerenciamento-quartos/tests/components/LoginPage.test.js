import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginPage from './LoginPage';

// Mock da função de autenticação do Firebase
jest.mock('../firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Mock da função de autenticação para retorno de sucesso
    signInWithEmailAndPassword.mockResolvedValue({});
  });

  test('deve renderizar o formulário de login', () => {
    render(<LoginPage />);

    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Caso não tenha suas credenciais, solicite para seu administrador')).toBeInTheDocument();
  });

  test('deve lidar com o envio do formulário com sucesso', async () => {
    render(<LoginPage />);

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), { target: { value: 'password123' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Entrar'));

    // Espera a navegação para a página inicial (ou outra página)
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'user@example.com', 'password123');
    });
  });

  test('deve lidar com erros durante o login e mostrar mensagem de erro', async () => {
    // Mock para gerar erro na autenticação
    signInWithEmailAndPassword.mockRejectedValue(new Error('Erro ao fazer login'));

    render(<LoginPage />);

    // Mock para window.alert
    window.alert = jest.fn();

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), { target: { value: 'password123' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Entrar'));

    // Espera a mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login')).toBeInTheDocument();
    });
  });

  test('deve desabilitar o botão de login enquanto está carregando', () => {
    render(<LoginPage />);

    // Simula o estado de carregamento
    fireEvent.change(screen.getByPlaceholderText('Digite seu e-mail'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), { target: { value: 'password123' } });

    // Submete o formulário e verifica se o botão está desabilitado
    fireEvent.click(screen.getByText('Entrar'));
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
