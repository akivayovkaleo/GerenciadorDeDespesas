'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { Expense } from '@/lib/calculations';

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega despesas do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        const parsed = JSON.parse(saved).map((exp: any) => ({
          ...exp,
          date: new Date(exp.date),
        }));
        setExpenses(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva despesas no localStorage sempre que mudam
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isLoading]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 11) + Date.now(),
      ...expense,
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Gerenciador de Despesas</h1>
        <p className="text-gray-600">Registre e gerencie todas as despesas da sua mercearia</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-blue-900">
          <p className="text-gray-600 text-sm font-medium">Total de Despesas</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">{expenses.length} registros</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm font-medium">Média por Despesa</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            R$ {avgAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">Valor médio</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-medium">Categorias</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {new Set(expenses.map(e => e.category)).size}
          </p>
          <p className="text-xs text-gray-500 mt-2">Tipos diferentes</p>
        </div>
      </div>

      {/* Formulário para Adicionar Despesa */}
      <ExpenseForm onAddExpense={handleAddExpense} />

      {/* Lista de Despesas */}
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </div>
  );
}
