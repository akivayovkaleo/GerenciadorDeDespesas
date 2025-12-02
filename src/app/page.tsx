'use client';

import { useState, useEffect } from 'react';
import AverageAnalysis from '@/components/AverageAnalysis';
import { Expense } from '@/lib/calculations';

export default function HomePage() {
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
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Análise de Médias</h1>
        <p className="text-gray-600">Visualize as médias de despesas da sua mercearia</p>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            Nenhuma despesa registrada ainda.
          </p>
          <p className="text-gray-400">
            Acesse o <strong>Gerenciador</strong> na sidebar para adicionar suas primeiras despesas.
          </p>
        </div>
      ) : (
        <AverageAnalysis expenses={expenses} />
      )}
    </div>
  );
}

