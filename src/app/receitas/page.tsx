"use client";

import React, { useEffect, useState } from 'react';
import { Expense } from '@/lib/calculations';
import ExpenseList from '@/components/ExpenseList';

export default function ReceitasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('expenses');
      if (saved) setExpenses(JSON.parse(saved) as Expense[]);
    } catch (e) {
      console.error('Erro ao carregar despesas:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const receitas = expenses.filter(e => e.type === 'receita');

  const handleDelete = (id: string) => {
    const n = expenses.filter(e => e.id !== id);
    setExpenses(n);
    localStorage.setItem('expenses', JSON.stringify(n));
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Receitas</h1>
        <p className="text-gray-600">Lista de entradas registradas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-600">R$ {receitas.reduce((s, r) => s + r.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500 mt-2">{receitas.length} registros</p>
        </div>
      </div>

      <ExpenseList expenses={receitas} onDeleteExpense={handleDelete} />
    </div>
  );
}
