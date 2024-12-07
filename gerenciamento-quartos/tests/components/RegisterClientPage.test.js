import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import RegisterClientPage from './RegisterClientPage';

// Mock das funções do Firebase Firestore
jest.mock('../firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('RegisterClientPage', () => {
  beforeEach(() => {
    // Mock da resposta de addDoc
    addDoc.mockResolvedValue({});
  });

  test('deve renderizar o formulário de cadastro', () => {
    render(<RegisterClientPage />);
    
    expect(screen.getByPlaceholderText('Digite Seu Nome Completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu CPF')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite Seu Email')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  test('deve lidar com o envio do formulário e mostrar mensagem de sucesso', async () => {
    render(<RegisterClientPage />);

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Digite Seu Nome Completo'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Digite seu CPF'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Digite Seu Email'), { target: { value: 'john@example.com' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Cadastrar'));

    // Espera a mensagem de sucesso
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Cliente cadastrado com sucesso!');
    });
  });

  test('deve lidar com erros durante o cadastro e mostrar mensagem de erro', async () => {
    // Mock da resposta de addDoc para gerar erro
    addDoc.mockRejectedValue(new Error('Erro ao cadastrar cliente'));

    render(<RegisterClientPage />);

    // Mock para window.alert
    window.alert = jest.fn();

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Digite Seu Nome Completo'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Digite seu CPF'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Digite Seu Email'), { target: { value: 'john@example.com' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Cadastrar'));

    // Espera a mensagem de erro
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao cadastrar cliente: Erro ao cadastrar cliente');
    });
  });

  test('deve desabilitar o botão de cadastro enquanto está carregando', () => {
    render(<RegisterClientPage />);

    // Simula o estado de carregamento
    fireEvent.change(screen.getByPlaceholderText('Digite Seu Nome Completo'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Digite seu CPF'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Digite Seu Email'), { target: { value: 'john@example.com' } });

    fireEvent.click(screen.getByText('Cadastrar'));

    // Verifica se o botão está desabilitado durante o carregamento
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
