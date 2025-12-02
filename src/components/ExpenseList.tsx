'use client';

import { Expense } from '@/lib/calculations';
import { FiTrash2 } from 'react-icons/fi';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>Nenhuma despesa registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-blue-900 text-white">
        <h2 className="text-2xl font-bold">Histórico de Despesas</h2>
        <p className="mt-2 text-yellow-300">
          Total: R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Valor</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Ação</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense, idx) => (
              <tr
                key={expense.id}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-yellow-50 transition`}
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(expense.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                  R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Deletar despesa"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
