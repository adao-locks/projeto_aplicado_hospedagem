import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HomePage from './HomePage';
import { getFirestore, collection, query, orderBy, getDocs, limit, where } from 'firebase/firestore';

// Mock da biblioteca Firebase
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    // Mock dos métodos de Firebase
    const mockGetDocs = jest.fn();
    const mockCollection = jest.fn();
    const mockQuery = jest.fn();
    const mockOrderBy = jest.fn();
    const mockLimit = jest.fn();
    const mockWhere = jest.fn();

    // Configurar os mocks para retornar valores fictícios
    getFirestore.mockReturnValue({});
    collection.mockReturnValue({});
    query.mockReturnValue({});
    orderBy.mockReturnValue({});
    limit.mockReturnValue({});
    where.mockReturnValue({});
    
    mockGetDocs.mockResolvedValue({
      docs: [
        { data: () => ({ name: 'Client 1' }) },
        { data: () => ({ name: 'Client 2' }) },
        { data: () => ({ name: 'Client 3' }) },
        { data: () => ({ name: 'Client 4' }) },
        { data: () => ({ name: 'Client 5' }) },
      ],
      size: 5
    });

    getDocs.mockImplementation(mockGetDocs);
    collection.mockImplementation(mockCollection);
    query.mockImplementation(mockQuery);
    orderBy.mockImplementation(mockOrderBy);
    limit.mockImplementation(mockLimit);
    where.mockImplementation(mockWhere);
  });

  test('deve renderizar o título e a data atual', () => {
    render(<HomePage />);

    expect(screen.getByText(/Olá, Colaborador!/i)).toBeInTheDocument();
    expect(screen.getByText(/Hoje é dia/i)).toBeInTheDocument();
  });

  test('deve exibir os últimos 5 clientes cadastrados', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Últimos 5 clientes cadastrados/i)).toBeInTheDocument();
      expect(screen.getByText('Client 1')).toBeInTheDocument();
      expect(screen.getByText('Client 2')).toBeInTheDocument();
      expect(screen.getByText('Client 3')).toBeInTheDocument();
      expect(screen.getByText('Client 4')).toBeInTheDocument();
      expect(screen.getByText('Client 5')).toBeInTheDocument();
    });
  });

  test('deve calcular e exibir a porcentagem de crescimento', async () => {
    // Mock da porcentagem de crescimento, se necessário
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Crescimento Mensal pousada Ypuã/i)).toBeInTheDocument();
      expect(screen.getByText('100.00%')).toBeInTheDocument(); // Ajuste conforme esperado
    });
  });
});
