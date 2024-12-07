// src/__tests__/CreateRoomPage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateRoomPage from '../pages/CreateRoomPage';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('CreateRoomPage', () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  test('renders form fields', () => {
    render(<CreateRoomPage />);

    expect(screen.getByPlaceholderText('Digite o Nome Do Quarto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite Descrição')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite Ocupação Máxima')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite Preço por Noite')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite Amenidades (separadas por vírgula)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('cole URL da Imagem')).toBeInTheDocument();
  });

  test('submits form with correct values', async () => {
    render(<CreateRoomPage />);

    // Mock implementation of addDoc
    addDoc.mockResolvedValue({});

    fireEvent.change(screen.getByPlaceholderText('Digite o Nome Do Quarto'), {
      target: { value: 'Quarto Deluxe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Descrição'), {
      target: { value: 'Descrição do quarto deluxe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Ocupação Máxima'), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Preço por Noite'), {
      target: { value: '150' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Amenidades (separadas por vírgula)'), {
      target: { value: 'Wi-Fi, Ar condicionado' },
    });
    fireEvent.change(screen.getByPlaceholderText('cole URL da Imagem'), {
      target: { value: 'http://example.com/imagem.jpg' },
    });

    fireEvent.click(screen.getByText('Criar Quarto'));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        collection(db, 'quartos'),
        expect.objectContaining({
          nome: 'Quarto Deluxe',
          descricao: 'Descrição do quarto deluxe',
          ocupacaoMaxima: 4,
          disponibilidade: true,
          precoPorNoite: 150,
          amenidades: ['Wi-Fi', 'Ar condicionado'],
          imagemUrl: 'http://example.com/imagem.jpg',
        })
      );
      expect(navigate).toHaveBeenCalledWith('/rooms');
    });
  });

  test('handles errors during submission', async () => {
    render(<CreateRoomPage />);

    // Mock implementation of addDoc to throw an error
    addDoc.mockRejectedValue(new Error('Erro de teste'));

    fireEvent.change(screen.getByPlaceholderText('Digite o Nome Do Quarto'), {
      target: { value: 'Quarto Deluxe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Descrição'), {
      target: { value: 'Descrição do quarto deluxe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Ocupação Máxima'), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Preço por Noite'), {
      target: { value: '150' },
    });
    fireEvent.change(screen.getByPlaceholderText('Digite Amenidades (separadas por vírgula)'), {
      target: { value: 'Wi-Fi, Ar condicionado' },
    });
    fireEvent.change(screen.getByPlaceholderText('cole URL da Imagem'), {
      target: { value: 'http://example.com/imagem.jpg' },
    });

    fireEvent.click(screen.getByText('Criar Quarto'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar quarto: Erro de teste')).toBeInTheDocument();
    });
  });

  test('disables submit button while loading', () => {
    render(<CreateRoomPage />);

    expect(screen.getByText('Criar Quarto')).toBeEnabled();

    fireEvent.click(screen.getByText('Criar Quarto'));

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
