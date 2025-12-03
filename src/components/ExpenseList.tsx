'use client';

import { Expense } from '@/lib/calculations';
import { FiTrash2 } from 'react-icons/fi';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onTogglePaid?: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense, onTogglePaid }: ExpenseListProps) {
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
        <h2 className="text-2xl font-bold">Histórico de Movimentos</h2>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
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
                  {formatISOToBR(expense.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <span className={`${expense.type === 'receita' ? 'text-green-700' : 'text-red-700'}`}>
                    {expense.type === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                  {expense.installments && (
                    <div className="text-xs text-gray-500">{expense.installments}x • {expense.intervalDays || 30}d</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {expense.dueDate ? <div>Venc.: {formatISOToBR(expense.dueDate)}</div> : <div>-</div>}
                  <div className="text-xs mt-1">
                    {expense.paid ? <span className="text-green-700">Pago</span> : <span className="text-red-600">Pendente</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                  R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                  {onTogglePaid && (
                    <button
                      onClick={() => onTogglePaid(expense.id)}
                      className={`px-2 py-1 rounded text-sm ${expense.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      title={expense.paid ? 'Marcar como pendente' : 'Marcar como pago'}
                    >
                      {expense.paid ? 'Pago' : 'Pagar'}
                    </button>
                  )}

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

function formatISOToBR(dateStr?: string) {
  if (!dateStr) return '-';
  // expect YYYY-MM-DD
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    return `${m[3]}/${m[2]}/${m[1]}`;
  }
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}
