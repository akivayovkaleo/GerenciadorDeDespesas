import { isClosedDay } from './holidays'; // Mantém a importação, mesmo que não seja usada agora

export interface Expense {
  id: string;
  description: string;
  amount: number;
  // store dates as ISO strings (YYYY-MM-DD) to avoid timezone shifts in UI
  date: string;
  // optional due date for pending payments (ISO string)
  dueDate?: string;
  // whether the expense is already paid
  paid?: boolean;
  category: string;
  type?: 'receita' | 'despesa';
  // payment plan: if the expense is going to be paid in installments,
  // these fields are stored for reference (not required)
  installments?: number;
  intervalDays?: number; // interval between installments in days
}

export interface AverageData {
  date: Date;
  average: number | null; // Permitir null para quando não há dados
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
 * Encontra os últimos N dias do mês especificado que tiveram movimento (despesas registradas)
 * Procura o dia X no mês Y. Se não houver movimento, procura no mês anterior.
 */
export function findValidDaysWithMovement(
  targetDay: number,
  monthsBack: number,
  expenses: Expense[]
): Date[] {
  const validDays: Date[] = [];
  const today = new Date();

  for (let i = 0; i < monthsBack; i++) {
    // Começa procurando no mês atual (ou retroativo) no dia especificado
    let year = today.getFullYear();
    let month = today.getMonth() - i;
    let day = targetDay;

    // Ajuste para meses/anos negativos (ex: janeiro - 1 = dezembro do ano anterior)
    while (month < 0) {
      month += 12;
      year -= 1;
    }

    let found = false;
    let attempts = 0;
    const maxAttempts = 12; // Limite de meses para tentar (1 ano)

    // Loop para tentar encontrar o dia com movimento, retrocedendo meses se necessário
    while (!found && attempts < maxAttempts) {
      const checkDate = new Date(year, month, day);

      // Verifica se o dia existe no mês (evita problemas com meses com menos dias)
      if (checkDate.getMonth() !== month) {
        // O dia especificado não existe (ex: 31 de abril), pula para o mês anterior
        month--;
        if (month < 0) {
          month = 11;
          year--;
        }
        attempts++;
        continue;
      }

      // Verifica se há movimento nesse dia específico
      const hasMovement = expenses.some(exp => {
        const expDate = new Date(exp.date);
        return (
          expDate.getFullYear() === checkDate.getFullYear() &&
          expDate.getMonth() === checkDate.getMonth() &&
          expDate.getDate() === checkDate.getDate()
        );
      });

      if (hasMovement) {
        validDays.push(new Date(checkDate)); // Adiciona o dia encontrado
        found = true;
      } else {
        // Não encontrou movimento, tenta no mês anterior
        month--;
        if (month < 0) {
          month = 11;
          year--;
        }
        attempts++;
      }
    }
  }

  return validDays;
}

/**
 * Calcula a média de despesas para um dia específico considerando os últimos N meses
 * Retorna null para a média se não houver dados suficientes.
 */
export function calculateDailyAverage(
  targetDay: number,
  monthsBack: number,
  expenses: Expense[]
): AverageData {
  const validDays = findValidDaysWithMovement(targetDay, monthsBack, expenses);
  
  if (validDays.length === 0) {
    return {
      date: new Date(new Date().getFullYear(), new Date().getMonth(), targetDay),
      average: null, // Indica que não há dados
      dataPoints: 0,
    };
  }

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
  
  const average = totalAmount / validDays.length;
  
  return {
    date: new Date(new Date().getFullYear(), new Date().getMonth(), targetDay),
    average: parseFloat(average.toFixed(2)), // Arredonda para 2 casas decimais
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