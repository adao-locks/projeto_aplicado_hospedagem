import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RoomDetailPage from './RoomDetailPage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Mock da biblioteca Firebase
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('RoomDetailPage', () => {
  beforeEach(() => {
    const mockGetDoc = jest.fn();
    const mockUpdateDoc = jest.fn();

    // Configura o mock para retornar dados fictícios
    doc.mockReturnValue({});
    getDoc.mockResolvedValue({
      exists: () => true,
      id: '1',
      data: () => ({
        nome: 'Quarto Teste',
        descricao: 'Descrição Teste',
        precoPorNoite: 100,
        ocupacaoMaxima: 2,
        imagemUrl: 'http://example.com/image.jpg',
        amenidades: ['Wi-Fi', 'Ar Condicionado'],
        reservas: [
          { dataInicio: { toDate: () => new Date('2024-07-01') }, dataFim: { toDate: () => new Date('2024-07-10') }, clienteId: '123' }
        ]
      }),
    });

    updateDoc.mockImplementation(mockUpdateDoc);
    doc.mockImplementation(mockGetDoc);
  });

  test('deve renderizar os detalhes do quarto e permitir edição', async () => {
    render(<RoomDetailPage />);

    // Verifica os detalhes do quarto
    expect(await screen.findByText('Detalhes do Quarto - Quarto Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição Teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi, Ar Condicionado')).toBeInTheDocument();

    // Verifica o botão de editar
    expect(screen.getByText('Editar')).toBeInTheDocument();

    // Muda para o modo de edição e preenche o formulário
    fireEvent.click(screen.getByText('Editar'));

    fireEvent.change(screen.getByLabelText('Nome:'), { target: { value: 'Quarto Editado' } });
    fireEvent.change(screen.getByLabelText('Descrição:'), { target: { value: 'Descrição Editada' } });
    fireEvent.change(screen.getByLabelText('Preço por Noite:'), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText('Ocupação Máxima:'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('Amenidades (separadas por vírgula):'), { target: { value: 'Wi-Fi, TV' } });
    fireEvent.change(screen.getByLabelText('URL da Imagem:'), { target: { value: 'http://example.com/new-image.jpg' } });

    // Envia o formulário
    fireEvent.click(screen.getByText('Salvar'));

    // Verifica se a função de atualização foi chamada com os dados corretos
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      nome: 'Quarto Editado',
      descricao: 'Descrição Editada',
      precoPorNoite: 150,
      ocupacaoMaxima: 3,
      imagemUrl: 'http://example.com/new-image.jpg',
      amenidades: ['Wi-Fi', 'TV']
    });
  });

  test('deve exibir mensagem de erro se ocorrer um erro ao buscar os dados', async () => {
    getDoc.mockRejectedValue(new Error('Erro ao buscar o quarto'));

    render(<RoomDetailPage />);

    expect(await screen.findByText('Erro ao buscar informações do quarto.')).toBeInTheDocument();
  });

  test('deve exibir mensagem se o quarto não for encontrado', async () => {
    getDoc.mockResolvedValue({ exists: () => false });

    render(<RoomDetailPage />);

    expect(await screen.findByText('Quarto não encontrado.')).toBeInTheDocument();
  });

  test('deve exibir mensagem se não houver reservas', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      id: '1',
      data: () => ({
        nome: 'Quarto Teste',
        descricao: 'Descrição Teste',
        precoPorNoite: 100,
        ocupacaoMaxima: 2,
        imagemUrl: 'http://example.com/image.jpg',
        amenidades: ['Wi-Fi'],
        reservas: []
      }),
    });

    render(<RoomDetailPage />);

    expect(await screen.findByText('Nenhuma reserva encontrada para este quarto.')).toBeInTheDocument();
  });
});
