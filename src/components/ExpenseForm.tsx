'use client';

import { useState } from 'react';
import { Expense } from '@/lib/calculations';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Geral');
  const [type, setType] = useState<'despesa' | 'receita'>('despesa');
  const [installments, setInstallments] = useState(1);
  const [intervalDays, setIntervalDays] = useState(30);

  const categories = ['Geral', 'Alimentos', 'Fornecedor', 'Aluguel', 'Energia', 'Funcionários', 'Outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    // If installments > 1, create multiple scheduled payments spaced by intervalDays
    const amt = parseFloat(amount);
    const baseDate = new Date(date);
    const parts = Math.max(1, installments);

    // Work in cents to avoid floating point rounding issues
    const totalCents = Math.round(amt * 100);
    const baseCents = Math.floor(totalCents / parts);
    const remainder = totalCents - baseCents * parts;

    for (let i = 0; i < parts; i++) {
      const expDate = new Date(baseDate);
      expDate.setDate(baseDate.getDate() + i * intervalDays);

      // add remainder to the last installment so the sum matches original amount
      const cents = baseCents + (i === parts - 1 ? remainder : 0);
      const partAmount = cents / 100;

      onAddExpense({
        description,
        amount: parseFloat(partAmount.toFixed(2)),
        date: expDate,
        category,
        type,
        installments: parts > 1 ? parts : undefined,
        intervalDays: parts > 1 ? intervalDays : undefined,
      });
    }

    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Geral');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Adicionar Lançamento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Ex: Compra de produtos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'despesa' | 'receita')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="despesa">Despesa</option>
            <option value="receita">Receita (Entrada)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parcelas</label>
          <input
            type="number"
            min={1}
            value={installments}
            onChange={(e) => setInstallments(Math.max(1, Number(e.target.value) || 1))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Intervalo entre parcelas (dias)</label>
          <input
            type="number"
            min={1}
            value={intervalDays}
            onChange={(e) => setIntervalDays(Math.max(1, Number(e.target.value) || 30))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-end">
          <p className="text-sm text-gray-500">Se quiser criar um pagamento único, deixe Parcelas = 1</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        Adicionar Lançamento
      </button>
    </form>
  );
}
