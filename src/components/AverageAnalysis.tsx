'use client';

import { useState, useMemo } from 'react';
import { Expense, calculateDailyAverage, calculateWeeklyAverage, calculateMonthlyAverage, getWeekNumber } from '@/lib/calculations';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface AverageAnalysisProps {
  expenses: Expense[];
}

export default function AverageAnalysis({ expenses }: AverageAnalysisProps) {
  // Get today's date as ISO string to avoid timezone issues
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [monthsBack, setMonthsBack] = useState(3);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Calcula média diária de movimento (apenas receitas/entradas)
  const dailyAverage = useMemo(() => {
    const receipts = expenses.filter(e => e.type === 'receita');
    return calculateDailyAverage(selectedDay, monthsBack, receipts);
  }, [selectedDay, monthsBack, expenses]);

  // Calcula médias semanais dos últimos 12 meses
  const weeklyAverages = useMemo(() => {
    const receipts = expenses.filter(e => e.type === 'receita');
    const weeks: Record<string, ReturnType<typeof calculateWeeklyAverage>> = {};
    const currentYear = new Date().getFullYear();
    for (let m = 0; m < 12; m++) {
      const checkDate = new Date(currentYear, today.getMonth() - m, 1);
      const year = checkDate.getFullYear();

      for (let d = 1; d <= 31; d++) {
        const testDate = new Date(year, checkDate.getMonth(), d);
        if (testDate.getMonth() !== checkDate.getMonth()) break;

        const week = getWeekNumber(testDate);
        const key = `${year}-W${week}`;

        if (!weeks[key]) {
          weeks[key] = calculateWeeklyAverage(week, year, receipts);
        }
      }
    }

    return Object.values(weeks)
      .filter(w => w.dataPoints > 0)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.week - a.week;
      })
      .slice(0, 12);
  }, [expenses, today]);

  // Calcula médias mensais dos últimos 12 meses
  const monthlyAverages = useMemo(() => {
    const receipts = expenses.filter(e => e.type === 'receita');
    const months = [];

    for (let i = 0; i < 12; i++) {
      const checkDate = new Date(today.getFullYear(), today.getMonth() - i);
      const month = checkDate.getMonth() + 1;
      const year = checkDate.getFullYear();
      const avg = calculateMonthlyAverage(month, year, receipts);

      if (avg.dataPoints > 0) {
        months.push(avg);
      }
    }

    return months;
  }, [expenses, today]);

  const handlePrevDay = () => {
    setSelectedDay(selectedDay === 1 ? 31 : selectedDay - 1);
  };

  const handleNextDay = () => {
    setSelectedDay(selectedDay === 31 ? 1 : selectedDay + 1);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-blue-900 text-white">
        <h2 className="text-2xl font-bold">Análise de Movimento</h2>
        <p className="text-yellow-300 mt-1">Visualize as médias de entrada (movimento) da mercearia</p>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'daily'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Diária
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'weekly'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'monthly'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensal
          </button>
        </div>

        {/* Daily Tab */}
        {activeTab === 'daily' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevDay}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <FiChevronLeft size={20} className="text-gray-600" />
                </button>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Dia selecionado</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedDay}</p>
                </div>
                <button
                  onClick={handleNextDay}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <FiChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Períodos (meses)
                </label>
                <select
                  value={monthsBack}
                  onChange={(e) => setMonthsBack(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  {[1, 2, 3, 6, 12].map((n) => (
                    <option key={n} value={n}>
                      Últimos {n} mês{n > 1 ? 'es' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyAverage.average === null ? (
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-l-4 border-red-600 col-span-2">
                  <p className="text-gray-600 text-center text-sm">
                    Nenhum dado encontrado para o dia {selectedDay} nos últimos {monthsBack} mês{monthsBack > 1 ? 'es' : ''}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-600 text-sm">Média do Dia {selectedDay}</p>
                    <p className="text-4xl font-bold text-blue-900 mt-2">
                      R$ {dailyAverage.average.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {dailyAverage.dataPoints} ponto{dailyAverage.dataPoints !== 1 ? 's' : ''} de dados (últimos {monthsBack} mês{monthsBack > 1 ? 'es' : ''})
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border-l-4 border-blue-900">
                    <p className="text-gray-600 text-sm">Detalhes</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm"><strong>Pontos de dados:</strong> {dailyAverage.dataPoints}</p>
                      <p className="text-sm"><strong>Período:</strong> Últimos {monthsBack} mês{monthsBack > 1 ? 'es' : ''}</p>
                      <p className="text-sm"><strong>Nota:</strong> Feriados e finais de semana são excluídos</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Weekly Tab */}
        {activeTab === 'weekly' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Médias Semanais</h3>
            {weeklyAverages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Semana</th>
                      <th className="px-4 py-2 text-left">Ano</th>
                      <th className="px-4 py-2 text-right">Média (R$)</th>
                      <th className="px-4 py-2 text-right">Pontos de Dados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyAverages.map((week, idx) => (
                      <tr
                        key={`${week.year}-W${week.week}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">Semana {week.week}</td>
                        <td className="px-4 py-3 text-gray-600">{week.year}</td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-900">
                          R$ {week.average.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">{week.dataPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Sem dados de despesas para exibir</p>
            )}
          </div>
        )}

        {/* Monthly Tab */}
        {activeTab === 'monthly' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Médias Mensais</h3>
            {monthlyAverages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Mês</th>
                      <th className="px-4 py-2 text-left">Ano</th>
                      <th className="px-4 py-2 text-right">Total (R$)</th>
                      <th className="px-4 py-2 text-right">Média (R$)</th>
                      <th className="px-4 py-2 text-right">Despesas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyAverages.map((month, idx) => {
                      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                      return (
                        <tr
                          key={`${month.year}-${month.month}`}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {monthNames[month.month - 1]}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{month.year}</td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-900">
                            R$ {month.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-yellow-600">
                            R$ {month.average.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">{month.dataPoints}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Sem dados de despesas para exibir</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}