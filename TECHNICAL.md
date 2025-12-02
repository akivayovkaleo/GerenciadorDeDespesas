# 📚 Documentação Técnica - Gerenciador de Despesas

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Componentes](#componentes)
4. [Funções de Cálculo](#funções-de-cálculo)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [API Interna](#api-interna)

---

## 🎯 Visão Geral

O **Gerenciador de Despesas** é uma aplicação web completa para gerenciar e analisar gastos de pequenos negócios, especialmente mercearias.

### Stack Técnico
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS 3
- **Armazenamento**: localStorage (client-side)
- **Icons**: React Icons
- **Data Manipulation**: date-fns (pronto para usar)

### Características Principais
- ✅ 100% Client-side (funciona offline)
- ✅ TypeScript completo
- ✅ Responsivo em todas as resoluções
- ✅ Cálculos inteligentes de média
- ✅ Interface intuitiva

---

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── app/                          # Páginas (Next.js App Router)
│   ├── page.tsx                  # Home - Análise de Médias
│   ├── layout.tsx                # Layout raiz com Sidebar
│   ├── globals.css               # Estilos globais
│   └── despesas/
│       └── page.tsx              # Página de Gerenciador
│
├── components/                   # Componentes React reutilizáveis
│   ├── Sidebar.tsx              # Navegação principal
│   ├── ExpenseForm.tsx          # Formulário de entrada
│   ├── ExpenseList.tsx          # Tabela de histórico
│   └── AverageAnalysis.tsx      # Análise de médias
│
└── lib/                          # Funções utilitárias
    ├── firebase.ts              # Config Firebase (opcional)
    ├── calculations.ts          # Lógica de negócio
    └── holidays.ts              # Lista de feriados
```

### Diagrama de Fluxo
```
┌─────────────────────┐
│   layout.tsx        │
│  (com Sidebar)      │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │          │
┌─────▼──┐  ┌───▼────────────┐
│ Home   │  │ /despesas      │
│ Médias │  │ Gerenciador    │
└────────┘  └────────────────┘
      │              │
      └──────┬───────┘
             │
        localStorage
```

---

## 🧩 Componentes

### 1. **Sidebar.tsx**
Navegação lateral com links para as seções principais.

```typescript
// Props: nenhuma
// Estado: nenhum (stateless)
// Renderiza: Links de navegação com ícones
```

**Recursos:**
- Links para Home e Gerenciador
- Ícones do react-icons
- Responsive (sticky no desktop)
- Hover effects com cores customizadas

---

### 2. **ExpenseForm.tsx**
Formulário para adicionar novas despesas.

```typescript
interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}
```

**Campos:**
- Descrição (texto)
- Valor (número, 2 casas decimais)
- Data (date picker)
- Categoria (select com 7 opções)

**Validações:**
- Descrição e valor obrigatórios
- Valor deve ser número positivo
- Data padrão: hoje

---

### 3. **ExpenseList.tsx**
Tabela com histórico de despesas.

```typescript
interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}
```

**Recursos:**
- Ordenação por data (descending)
- Cards de resumo (total, média)
- Botão deletar por linha
- Zebra striping para leitura
- Hover effects

---

### 4. **AverageAnalysis.tsx**
Análise inteligente de médias em 3 abas.

```typescript
interface AverageAnalysisProps {
  expenses: Expense[];
}
```

**Abas:**
1. **Diária**: Selecione dia, configure meses
2. **Semanal**: Últimas 12 semanas
3. **Mensal**: Últimos 12 meses

**Controles:**
- Seletor de dia (botões prev/next)
- Seletor de períodos (1-12 meses)
- Tabelas com dados detalhados

---

## 🔢 Funções de Cálculo

### Arquivo: `lib/calculations.ts`

#### 1. `findValidDaysWithMovement()`
```typescript
findValidDaysWithMovement(
  targetDay: number,      // 1-31
  monthsBack: number,     // Quantos meses analisar
  expenses: Expense[]
): Date[]
```

**Algoritmo:**
1. Para cada mês anterior (até monthsBack)
2. Tenta usar o dia target do mês
3. Se for feriado/domingo, desce até encontrar dia útil
4. Verifica se há despesa registrada nesse dia
5. Se sim, adiciona à lista de valid days

**Exemplo:**
```
Entrada: targetDay=2, monthsBack=3
Saída: [2024-12-02, 2024-11-02, 2024-10-02]
(se todos tiveram movimento)
```

#### 2. `calculateDailyAverage()`
```typescript
calculateDailyAverage(
  targetDay: number,
  monthsBack: number,
  expenses: Expense[]
): AverageData
```

**Lógica:**
1. Chama findValidDaysWithMovement()
2. Soma todas as despesas desses dias
3. Divide pela quantidade de dias encontrados
4. Retorna média + pontos de dados

#### 3. `calculateWeeklyAverage()`
```typescript
calculateWeeklyAverage(
  weekNumber: number,    // 1-53
  year: number,
  expenses: Expense[]
): WeeklyAverage
```

**Usa:** ISO 8601 week numbering

#### 4. `calculateMonthlyAverage()`
```typescript
calculateMonthlyAverage(
  month: number,         // 1-12
  year: number,
  expenses: Expense[]
): MonthlyAverage
```

**Retorna:** Total e média do mês

---

## 📊 Fluxo de Dados

### Adicionar Despesa
```
ExpenseForm
    ↓
handleSubmit() válida dados
    ↓
onAddExpense() callback
    ↓
page.tsx: setExpenses([...expenses, new])
    ↓
useEffect salva em localStorage
    ↓
AverageAnalysis recebe novo expenses prop
    ↓
useMemo recalcula médias
    ↓
UI atualiza com novos dados
```

### Carregar Dados
```
page.tsx mount
    ↓
useEffect() lê localStorage
    ↓
JSON.parse() converte datas
    ↓
setExpenses(parsed)
    ↓
isLoading = false
    ↓
Componentes recebem props.expenses
    ↓
UI renderiza dados
```

---

## 🔌 API Interna

### Tipos Principais

```typescript
// Expense.ts
interface Expense {
  id: string;           // unique identifier
  description: string;  // Descrição da despesa
  amount: number;       // Valor em reais
  date: Date;          // Data ISO
  category: string;    // Categoria
}

// AverageData.ts
interface AverageData {
  date: Date;
  average: number;     // Média calculada
  dataPoints: number;  // Quantidade de dados
}

// WeeklyAverage.ts
interface WeeklyAverage {
  week: number;        // 1-53
  year: number;
  average: number;
  dataPoints: number;
}

// MonthlyAverage.ts
interface MonthlyAverage {
  month: number;       // 1-12
  year: number;
  average: number;
  total: number;
  dataPoints: number;
}
```

### Feriados

```typescript
// holidays.ts
export const FIXED_HOLIDAYS: [number, number][] = [
  [1, 1],    // Ano Novo
  [4, 21],   // Tiradentes
  [5, 1],    // Dia do Trabalho
  ...
];

export function isHoliday(date: Date): boolean
export function isWeekend(date: Date): boolean
export function isClosedDay(date: Date): boolean
```

---

## 💾 Persistência

### localStorage Schema

```javascript
// Key: 'expenses'
// Value: JSON array

[
  {
    id: "1234567890",
    description: "Compra de produtos",
    amount: 1200.50,
    date: "2024-12-02T00:00:00.000Z",
    category: "Alimentos"
  },
  ...
]
```

### Conversão de Datas
```typescript
// Ao salvar
const toStore = expenses.map(exp => ({
  ...exp,
  date: exp.date.toISOString() // Date → String
}));
localStorage.setItem('expenses', JSON.stringify(toStore));

// Ao carregar
const fromStore = JSON.parse(localStorage.getItem('expenses'));
const parsed = fromStore.map(exp => ({
  ...exp,
  date: new Date(exp.date) // String → Date
}));
```

---

## 🎨 Temas e Cores

### Paleta Principal
```css
--color-blue-navy: #001f3f    /* Azul marinho */
--color-yellow-burned: #cc7a00 /* Amarelo queimado */
```

### Aplicação
- **Backgrounds**: Azul marinho
- **Botões primários**: Amarelo queimado
- **Borders/Highlights**: Amarelo queimado
- **Text**: Azul marinho em backgrounds claros

### Tailwind Classes Customizadas
```typescript
// tailwind.config.ts
colors: {
  'blue-navy': '#001f3f',
  'yellow-burned': '#cc7a00',
}
```

---

## ⚡ Performance

### Otimizações
- ✅ useMemo para cálculos pesados
- ✅ Next.js automatic code splitting
- ✅ Static generation onde possível
- ✅ CSS minimizado pelo Tailwind

### Bundle Size
- Aproximado: ~90KB (First Load JS)
- React + Next.js: ~60KB
- Tailwind CSS: ~15KB
- Icons (tree-shaked): ~10KB

---

## 🧪 Testando Localmente

### Com Dados de Teste
```bash
# 1. Abra DevTools (F12)
# 2. Console
# 3. Cole:

const EXPENSES = [
  { id: '1', description: 'Teste', amount: 100, 
    date: '2024-12-02', category: 'Geral' }
];
const exp = EXPENSES.map(e => ({
  ...e, date: new Date(e.date)
}));
localStorage.setItem('expenses', JSON.stringify(exp));

# 4. Recarregue (F5)
```

---

## 📈 Escalabilidade Futura

### Backend Integration
```typescript
// Exemplo de integração com API
async function syncExpenses() {
  const local = JSON.parse(localStorage.getItem('expenses'));
  const response = await fetch('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(local)
  });
  return response.json();
}
```

### Firebase Integration
```typescript
// Prepare for Firebase
import { addDoc, collection } from 'firebase/firestore';

async function addExpenseToFirebase(expense) {
  await addDoc(collection(db, 'expenses'), expense);
}
```

---

## 🔒 Segurança

### Implementado
- ✅ TypeScript (type safety)
- ✅ Input validation no form
- ✅ Client-side only (sem servidor)
- ✅ Sem chamadas HTTP externas

### Recomendações Futuras
- [ ] Rate limiting se adicionar backend
- [ ] Autenticação/autorização
- [ ] Encryption de dados sensíveis
- [ ] HTTPS only para produção

---

## 📖 Referências

- [Next.js 14 Docs](https://nextjs.org/docs)
- [React 18 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Icons](https://react-icons.github.io/react-icons)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Documentação v1.0 - Dezembro 2024**
