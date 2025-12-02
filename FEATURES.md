# 📊 Gerenciador de Despesas - Mercearia

Um aplicativo web completo para gerenciar despesas e calcular médias de gastos para mercearias e pequenos negócios.

## ✨ Funcionalidades

### 1. **Gerenciador de Despesas** 
- ➕ Adicionar despesas com descrição, valor, data e categoria
- 📋 Visualizar histórico completo de despesas
- 🗑️ Deletar despesas do registro
- 📊 Cards de resumo com total, média e número de categorias
- 💾 Dados salvos automaticamente no localStorage

### 2. **Análise de Médias Inteligente**
Três níveis de análise:

#### 📅 Média Diária
- Selecione qualquer dia do mês
- Configure quantos meses deseja analisar (1, 2, 3, 6 ou 12)
- **Lógica Inteligente**: Exclui feriados e domingos automaticamente
- Se o dia 02/12 for um domingo, busca o próximo dia 02 útil do mês anterior
- Mostra pontos de dados coletados

#### 📆 Média Semanal
- Visualize médias de gastos por semana
- Últimas 12 semanas com movimentação
- Inclui quantidade de transações e valor médio

#### 🗓️ Média Mensal
- Análise completa dos últimos 12 meses
- Total mensal, média de gastos e quantidade de despesas
- Histórico comparativo entre períodos

### 3. **Sistema de Cores**
- 🔵 **Azul Marinho (#001f3f)** - Elementos principais e backgrounds
- 🟡 **Amarelo Queimado (#cc7a00)** - Destaques e botões
- Paleta harmoniosa em toda a interface

### 4. **Sidebar de Navegação**
- Acesso rápido entre páginas
- Ícones intuitivos com react-icons
- Design responsivo e mobile-friendly

## 🚀 Como Usar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000`

### Build para Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Home - Análise de Médias
│   ├── despesas/
│   │   └── page.tsx          # Gerenciador de Despesas
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globais
├── components/
│   ├── Sidebar.tsx           # Navegação
│   ├── ExpenseForm.tsx       # Formulário de despesas
│   ├── ExpenseList.tsx       # Tabela de histórico
│   └── AverageAnalysis.tsx   # Análise de médias
└── lib/
    ├── firebase.ts           # Config Firebase (opcional)
    ├── calculations.ts       # Lógica de cálculos
    └── holidays.ts           # Lista de feriados
```

## 🔧 Dependências Principais

- **Next.js 14** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilos utilitários
- **React Icons** - Ícones SVG
- **date-fns** - Manipulação de datas (pronto para usar)

## 💾 Persistência de Dados

Os dados são armazenados no **localStorage** do navegador:
- ✅ Funciona offline
- ✅ Dados persistem entre sessões
- ⚠️ Limitado a ~5-10MB por domínio
- 💡 Pode ser facilmente integrado com Firebase ou backend

### Estrutura dos Dados
```typescript
interface Expense {
  id: string;                    // ID único
  description: string;           // Descrição da despesa
  amount: number;                // Valor em reais
  date: Date;                    // Data da despesa
  category: string;              // Categoria (Geral, Alimentos, etc)
}
```

## 📊 Lógica de Cálculo de Média

### Algoritmo de Exclusão de Feriados
```
1. Usuário seleciona dia 02/12/2025
2. Sistema busca os últimos 3 "dias 02" com movimento
3. Se 02/12 for domingo, busca 02/11 no mês anterior
4. Se 02/11 for feriado, busca 02/10
5. Calcula média dos 3 dias com movimento encontrados
```

### Feriados Inclusos (Brasil)
- Ano Novo (01/01)
- Tiradentes (21/04)
- Dia do Trabalho (01/05)
- Independência (07/09)
- Nossa Senhora Aparecida (12/10)
- Finados (02/11)
- Proclamação da República (15/11)
- Consciência Negra (20/11)
- Natal (25/12)

## 🎨 Customização

### Alterar Cores
No arquivo `tailwind.config.ts`:
```typescript
colors: {
  'blue-navy': '#001f3f',      // Altere aqui
  'yellow-burned': '#cc7a00',   // Ou aqui
}
```

### Adicionar Categorias
No arquivo `src/components/ExpenseForm.tsx`:
```typescript
const categories = ['Geral', 'Alimentos', 'Fornecedor', ...];
```

### Ajustar Feriados
No arquivo `src/lib/holidays.ts`:
```typescript
export const FIXED_HOLIDAYS = [
  [1, 1],   // Ano Novo
  // Adicione novos feriados aqui
];
```

## 📱 Responsividade

- ✅ Fully responsive
- ✅ Mobile-first design
- ✅ Tablet e desktop otimizados
- ✅ Sidebar colapsável em mobile

## 🔒 Segurança

- TypeScript para segurança de tipos
- Validação de inputs no formulário
- Dados locais (sem envio ao servidor)
- Inputs santizados

## 🚀 Melhorias Futuras

- [ ] Integração com Firebase para sincronização em nuvem
- [ ] Exportar dados em CSV/PDF
- [ ] Gráficos com Chart.js
- [ ] Modo escuro
- [ ] Autenticação de usuários
- [ ] API para backup automático
- [ ] Filtros avançados de despesas
- [ ] Relatórios customizáveis

## 📝 Changelog

### v1.0.0
- ✅ Gerenciador de despesas completo
- ✅ Sistema de análise de médias inteligente
- ✅ Exclusão automática de feriados/domingos
- ✅ Sidebar com navegação
- ✅ Tema azul marinho e amarelo queimado
- ✅ LocalStorage para persistência

## 📄 Licença

MIT - Sinta-se livre para usar em seus projetos!

## 👨‍💻 Desenvolvido por

Gerenciador de Despesas - v1.0

---

**Dica**: Use a página de **Análise de Médias** para entender o padrão de gastos da sua mercearia e tomar melhores decisões financeiras!
