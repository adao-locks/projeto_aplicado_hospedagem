import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RoomManagementPage from './RoomManagementPage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Mock da biblioteca Firebase
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe('RoomManagementPage', () => {
  beforeEach(() => {
    // Mock dos métodos de Firebase
    const mockGetDocs = jest.fn();
    const mockCollection = jest.fn();

    // Configurar os mocks para retornar valores fictícios
    getFirestore.mockReturnValue({});
    collection.mockReturnValue({});
    
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ nome: 'Quarto A', descricao: 'Descrição A', precoPorNoite: 100 }) },
        { id: '2', data: () => ({ nome: 'Quarto B', descricao: 'Descrição B', precoPorNoite: 150 }) },
      ],
    });

    getDocs.mockImplementation(mockGetDocs);
    collection.mockImplementation(mockCollection);
  });

  test('deve renderizar o título e a tabela de quartos', async () => {
    render(<RoomManagementPage />);

    expect(screen.getByText(/Gerenciamento de Quartos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Quarto A')).toBeInTheDocument();
      expect(screen.getByText('Descrição A')).toBeInTheDocument();
      expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
      expect(screen.getByText('Quarto B')).toBeInTheDocument();
      expect(screen.getByText('Descrição B')).toBeInTheDocument();
      expect(screen.getByText('R$ 150.00')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de carregamento enquanto os dados estão sendo carregados', () => {
    // Simula o estado de carregamento
    render(<RoomManagementPage />);

    expect(screen.getByText(/Carregando quartos.../i)).toBeInTheDocument();
  });

  test('deve exibir mensagem de erro se ocorrer um erro ao buscar os quartos', async () => {
    // Configurar o mock para lançar um erro
    getDocs.mockRejectedValue(new Error('Erro ao buscar quartos'));

    render(<RoomManagementPage />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao buscar quartos/i)).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem se nenhum quarto for encontrado', async () => {
    // Configurar o mock para retornar uma lista vazia
    getDocs.mockResolvedValue({ docs: [] });

    render(<RoomManagementPage />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhum quarto encontrado./i)).toBeInTheDocument();
    });
  });
});
