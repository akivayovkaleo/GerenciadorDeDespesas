// Lista de feriados brasileiros fixos
export const FIXED_HOLIDAYS = [
  [1, 1],   // Ano Novo
  [4, 21],  // Tiradentes
  [5, 1],   // Dia do Trabalho
  [9, 7],   // Independência
  [10, 12], // Nossa Senhora Aparecida
  [11, 2],  // Finados
  [11, 15], // Proclamação da República
  [11, 20], // Consciência Negra
  [12, 25], // Natal
];

export function isHoliday(date: Date): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return FIXED_HOLIDAYS.some(([m, d]) => m === month && d === day);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = domingo, 6 = sábado
}

export function isClosedDay(date: Date): boolean {
  return isHoliday(date) || isWeekend(date);
}
