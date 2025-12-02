import { isClosedDay } from './holidays';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export interface AverageData {
  date: Date;
  average: number;
  dataPoints: number;
}

export interface WeeklyAverage {
  week: number;
  year: number;
  average: number;
  dataPoints: number;
}

export interface MonthlyAverage {
  month: number;
  year: number;
  average: number;
  total: number;
  dataPoints: number;
}

/**
 * Encontra os últimos N dias do mês especificado que NÃO foram feriados/domingos
 * e que tiveram movimento (despesas registradas)
 */
export function findValidDaysWithMovement(
  targetDay: number,
  monthsBack: number,
  expenses: Expense[]
): Date[] {
  const validDays: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < monthsBack; i++) {
    const checkDate = new Date(today.getFullYear(), today.getMonth() - i, targetDay);
    
    // Se o dia é feriado ou fim de semana, tenta dias anteriores do mesmo mês
    let searchDate = new Date(checkDate);
    let attempts = 0;
    const maxAttempts = 31;
    
    while (isClosedDay(searchDate) && attempts < maxAttempts) {
      searchDate.setDate(searchDate.getDate() - 1);
      attempts++;
      
      // Se cruzou para o mês anterior, tenta no mês anterior
      if (searchDate.getMonth() !== checkDate.getMonth()) {
        const lastDayPrevMonth = new Date(checkDate.getFullYear(), checkDate.getMonth(), 0);
        searchDate = new Date(lastDayPrevMonth);
        break;
      }
    }
    
    // Verifica se houve movimento nesse dia
    const hasMovement = expenses.some(exp => {
      const expDate = new Date(exp.date);
      return (
        expDate.getFullYear() === searchDate.getFullYear() &&
        expDate.getMonth() === searchDate.getMonth() &&
        expDate.getDate() === searchDate.getDate()
      );
    });
    
    if (hasMovement) {
      validDays.push(new Date(searchDate));
    }
  }
  
  return validDays;
}

/**
 * Calcula a média de despesas para um dia específico considerando os últimos N meses
 */
export function calculateDailyAverage(
  targetDay: number,
  monthsBack: number,
  expenses: Expense[]
): AverageData {
  const validDays = findValidDaysWithMovement(targetDay, monthsBack, expenses);
  
  let totalAmount = 0;
  validDays.forEach(day => {
    const dayExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return (
        expDate.getFullYear() === day.getFullYear() &&
        expDate.getMonth() === day.getMonth() &&
        expDate.getDate() === day.getDate()
      );
    });
    totalAmount += dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  });
  
  const average = validDays.length > 0 ? totalAmount / validDays.length : 0;
  
  return {
    date: new Date(new Date().getFullYear(), new Date().getMonth(), targetDay),
    average,
    dataPoints: validDays.length,
  };
}

/**
 * Calcula a média semanal para uma semana específica
 */
export function calculateWeeklyAverage(
  weekNumber: number,
  year: number,
  expenses: Expense[]
): WeeklyAverage {
  const weekExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const expYear = expDate.getFullYear();
    const expWeek = getWeekNumber(expDate);
    
    return expYear === year && expWeek === weekNumber;
  });
  
  const total = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const average = weekExpenses.length > 0 ? total / weekExpenses.length : 0;
  
  return {
    week: weekNumber,
    year,
    average,
    dataPoints: weekExpenses.length,
  };
}

/**
 * Calcula a média mensal para um mês específico
 */
export function calculateMonthlyAverage(
  month: number,
  year: number,
  expenses: Expense[]
): MonthlyAverage {
  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getFullYear() === year && expDate.getMonth() + 1 === month;
  });
  
  const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const average = monthExpenses.length > 0 ? total / monthExpenses.length : 0;
  
  return {
    month,
    year,
    average,
    total,
    dataPoints: monthExpenses.length,
  };
}

/**
 * Retorna o número da semana (ISO 8601)
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Agrupa despesas por dia para visualização em planilha
 */
export function groupExpensesByDay(expenses: Expense[]): Record<string, Expense[]> {
  const grouped: Record<string, Expense[]> = {};
  
  expenses.forEach(exp => {
    const expDate = new Date(exp.date);
    const key = expDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(exp);
  });
  
  return grouped;
}

/**
 * Retorna as últimas N despesas
 */
export function getRecentExpenses(expenses: Expense[], limit: number = 10): Expense[] {
  return expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
