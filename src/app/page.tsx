"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

export default function Home() {
  const [dailyValue, setDailyValue] = useState<number | ''>('');
  const [dailyAverage, setDailyAverage] = useState<number | null>(null);
  const [weeklyAverage, setWeeklyAverage] = useState<number | null>(null);
  const [monthlyAverage, setMonthlyAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleAddValue = async () => {
    if (dailyValue === '') return;
    setAdding(true);
    setError(null);
    try {
      await addDoc(collection(db, 'movimentos'), {
        valor: dailyValue,
        data: serverTimestamp(),
      });
      setDailyValue('');
    } catch (error) {
      setError('Ocorreu um erro ao salvar o valor. Tente novamente.');
    } finally {
      setAdding(false);
    }
  };

  const handleCalculateAverage = async (period: 'day' | 'week' | 'month') => {
    setLoading(true);
    setError(null);
    const now = new Date();

    try {
      if (period === 'day') {
        const q = query(collection(db, 'movimentos'));
        const querySnapshot = await getDocs(q);

        const dayOfMonth = now.getDate();
        const filteredDocs = querySnapshot.docs.filter(doc => {
          const docDate = new Date(doc.data().data.seconds * 1000);
          return docDate.getDate() === dayOfMonth;
        });

        if (filteredDocs.length === 0) {
          setError('Nenhum dado encontrado para este dia do mês.');
          setDailyAverage(0);
          return;
        }

        let total = 0;
        filteredDocs.forEach(doc => {
          total += doc.data().valor;
        });

        const average = total / filteredDocs.length;
        setDailyAverage(average);
        return;
      }

      let startDate: Date;
      switch (period) {
        case 'week':
          const firstDayOfWeek = now.getDate() - now.getDay();
          startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek, 0, 0, 0);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
          break;
        default:
          return;
      }

      const q = query(collection(db, 'movimentos'), where('data', '>=', startDate));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Nenhum dado encontrado para o período selecionado.');
        if (period === 'week') setWeeklyAverage(0);
        if (period === 'month') setMonthlyAverage(0);
        return;
      }

      let total = 0;
      querySnapshot.forEach((doc) => {
        total += doc.data().valor;
      });

      const average = total / querySnapshot.size;

      if (period === 'week') setWeeklyAverage(average);
      if (period === 'month') setMonthlyAverage(average);

    } catch (error) {
      setError('Ocorreu um erro ao buscar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-azul-mercearia">Cálculo de Médias</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 transition-shadow hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Adicionar Movimento do Dia</h2>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={dailyValue}
            onChange={(e) => setDailyValue(Number(e.target.value))}
            placeholder="Digite o valor de hoje"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul-mercearia"
          />
          <button
            onClick={handleAddValue}
            className="bg-azul-mercearia text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            disabled={adding}
          >
            {adding ? 'Enviando...' : 'Adicionar'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Visualizar Médias</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleCalculateAverage('day')}
            className="bg-amarelo-queimado text-black px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            disabled={loading}
          >
            Média do Dia
          </button>
          <button
            onClick={() => handleCalculateAverage('week')}
            className="bg-amarelo-queimado text-black px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            disabled={loading}
          >
            Média da Semana
          </button>
          <button
            onClick={() => handleCalculateAverage('month')}
            className="bg-amarelo-queimado text-black px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            disabled={loading}
          >
            Média do Mês
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Carregando...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Período</th>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Data de Referência</th>
                <th className="py-3 px-4 border-b text-right font-semibold text-gray-700">Valor da Média</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">Média do Dia</td>
                <td className="py-3 px-4 border-b">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
                <td className="py-3 px-4 border-b text-right font-medium text-azul-mercearia">
                  {dailyAverage !== null ? `R$ ${dailyAverage.toFixed(2)}` : 'N/A'}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">Média da Semana</td>
                <td className="py-3 px-4 border-b">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
                <td className="py-3 px-4 border-b text-right font-medium text-azul-mercearia">
                  {weeklyAverage !== null ? `R$ ${weeklyAverage.toFixed(2)}` : 'N/A'}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">Média do Mês</td>
                <td className="py-3 px-4 border-b">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
                <td className="py-3 px-4 border-b text-right font-medium text-azul-mercearia">
                  {monthlyAverage !== null ? `R$ ${monthlyAverage.toFixed(2)}` : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
