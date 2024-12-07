import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ClientListPage from './ClientListPage';

// Mock dos métodos do Firebase Firestore
jest.mock('../firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('ClientListPage', () => {
  beforeEach(() => {
    // Mock das respostas do Firestore
    collection.mockImplementation(() => ({
      id: 'clients',
    }));
    getDocs.mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ name: 'John Doe', cpf: '123456789', email: 'john@example.com' }) },
        { id: '2', data: () => ({ name: 'Jane Doe', cpf: '987654321', email: 'jane@example.com' }) },
      ],
    });
    deleteDoc.mockResolvedValue({});
    updateDoc.mockResolvedValue({});
  });

  test('deve renderizar o estado de carregamento inicialmente', () => {
    render(<ClientListPage />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  test('deve renderizar a lista de clientes após o carregamento', async () => {
    render(<ClientListPage />);

    // Espera até que o componente termine de carregar
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  test('deve lidar com a exclusão de cliente', async () => {
    // Mock para window.confirm e window.alert
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    render(<ClientListPage />);

    // Espera até que o componente termine de carregar
    await waitFor(() => {
      const deleteButton = screen.getAllByText('Excluir')[0];
      fireEvent.click(deleteButton);

      // Espera que o alert seja chamado
      expect(window.alert).toHaveBeenCalledWith('Cliente removido com sucesso!');
    });
  });

  test('deve lidar com a edição de cliente', async () => {
    render(<ClientListPage />);

    // Espera até que o componente termine de carregar
    await waitFor(() => {
      const editButton = screen.getAllByText('Editar')[0];
      fireEvent.click(editButton);

      // Verifica se o formulário de edição é renderizado
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('CPF')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
  });

  test('deve lidar com a salvamento de cliente', async () => {
    // Mock para window.alert
    window.alert = jest.fn();
    render(<ClientListPage />);

    // Espera até que o componente termine de carregar
    await waitFor(() => {
      const editButton = screen.getAllByText('Editar')[0];
      fireEvent.click(editButton);

      fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'John Smith' } });
      fireEvent.change(screen.getByPlaceholderText('CPF'), { target: { value: '111111111' } });
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johnsmith@example.com' } });

      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);

      // Espera que o alert seja chamado
      expect(window.alert).toHaveBeenCalledWith('Cliente atualizado com sucesso!');
    });
  });
});
