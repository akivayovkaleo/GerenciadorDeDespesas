"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  type?: 'receita' | 'despesa';
};

const monthsToShow = 6;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(key: string) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
}

export default function GraficosPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'receita' | 'despesa'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('expenses');
      if (raw) {
        setExpenses(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Erro ao ler despesas do localStorage', e);
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => e.category && set.add(e.category));
    return ['all', ...Array.from(set)];
  }, [expenses]);

  // build last N months keys
  const now = new Date();
  const months: string[] = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterType !== 'all' && e.type !== filterType) return false;
      if (filterCategory !== 'all' && e.category !== filterCategory) return false;
      if (startDate && new Date(e.date) < new Date(startDate)) return false;
      if (endDate && new Date(e.date) > new Date(endDate)) return false;
      return true;
    });
  }, [expenses, filterType, filterCategory, startDate, endDate]);

  const byMonth: Record<string, { receita: number; despesa: number }> = {};
  months.forEach((m) => (byMonth[m] = { receita: 0, despesa: 0 }));

  filtered.forEach((e) => {
    const d = new Date(e.date);
    const k = monthKey(d);
    if (!byMonth[k]) return;
    if (e.type === 'receita') byMonth[k].receita += e.amount;
    else byMonth[k].despesa += e.amount;
  });

  const labels = months.map((m) => getMonthLabel(m));
  const receitaData = months.map((m) => Number(byMonth[m].receita.toFixed(2)));
  const despesaData = months.map((m) => Number(byMonth[m].despesa.toFixed(2)));

  const data = {
    labels,
    datasets: [
      {
        label: 'Receitas',
        data: receitaData,
        backgroundColor: '#0f172a',
      },
      {
        label: 'Despesas',
        data: despesaData,
        backgroundColor: '#b7791f',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v: any) => Number(v).toLocaleString('pt-BR') } },
    },
  };

  function exportCsv() {
    // export filtered items (not aggregated) to CSV
    const rows = [['id', 'description', 'amount', 'date', 'category', 'type']];
    filtered.forEach((e) => rows.push([e.id, e.description, e.amount.toFixed(2), e.date, e.category || '', e.type || '']));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movimentos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Gráficos de Movimentos</h2>
      <p className="text-sm text-gray-600 mb-4">Resumo dos últimos {monthsToShow} meses (receitas vs despesas)</p>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-3 flex-wrap items-center">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            Tipo:
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="px-2 py-1 border rounded">
              <option value="all">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </label>

          <label className="text-sm text-gray-600 flex items-center gap-2">
            Categoria:
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-2 py-1 border rounded">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-gray-600 flex items-center gap-2">
            De:
            <input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value || null)} className="px-2 py-1 border rounded" />
          </label>

          <label className="text-sm text-gray-600 flex items-center gap-2">
            Até:
            <input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || null)} className="px-2 py-1 border rounded" />
          </label>

          <div className="ml-auto">
            <button onClick={exportCsv} className="bg-blue-900 text-white px-3 py-1 rounded hover:opacity-90">Exportar CSV</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow" style={{ height: 360 }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
