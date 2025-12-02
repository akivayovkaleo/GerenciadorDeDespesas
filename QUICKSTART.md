# 🚀 Guia de Início Rápido

## Passo 1: Setup Inicial

```bash
# Clonar ou navegar para o projeto
cd GerenciadorDeDespesas

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Passo 2: Primeiro Acesso

Você verá a página "Análise de Médias" vazia. Isso é normal! Siga os passos abaixo para adicionar suas primeiras despesas.

## Passo 3: Carregar Dados de Teste (Opcional)

Se deseja testar a funcionalidade de cálculo de médias:

1. **Abra o DevTools**: Pressione `F12`
2. **Vá para a aba Console**: Clique em "Console"
3. **Copie e cole este código**:

```javascript
const SAMPLE_EXPENSES = [
  { id: '1', description: 'Compra de produtos', amount: 1200, date: '2024-12-02', category: 'Alimentos' },
  { id: '2', description: 'Fornecedor - Bebidas', amount: 800, date: '2024-12-02', category: 'Fornecedor' },
  { id: '3', description: 'Energia', amount: 450, date: '2024-12-05', category: 'Energia' },
  { id: '4', description: 'Limpeza', amount: 150, date: '2024-12-10', category: 'Outros' },
  { id: '5', description: 'Compra produtos', amount: 1100, date: '2024-11-02', category: 'Alimentos' },
  { id: '6', description: 'Bebidas e refrigerantes', amount: 750, date: '2024-11-02', category: 'Fornecedor' },
  { id: '7', description: 'Conta de água', amount: 200, date: '2024-11-08', category: 'Energia' },
  { id: '8', description: 'Material de limpeza', amount: 120, date: '2024-11-12', category: 'Outros' },
  { id: '9', description: 'Abastecimento', amount: 1050, date: '2024-10-02', category: 'Alimentos' },
  { id: '10', description: 'Fornecedor principal', amount: 900, date: '2024-10-02', category: 'Fornecedor' },
  { id: '11', description: 'Energia elétrica', amount: 380, date: '2024-10-07', category: 'Energia' },
];

const expenses = SAMPLE_EXPENSES.map(exp => ({
  ...exp,
  date: new Date(exp.date)
}));

localStorage.setItem('expenses', JSON.stringify(expenses));
console.log('✅ Dados de teste carregados!');
```

4. **Pressione Enter**
5. **Recarregue a página**: `F5`

Agora você verá dados de teste!

## Passo 4: Navegação

### 📊 Análise de Médias (Home)
- Clique em **"Análise de Médias"** na sidebar
- Selecione um dia (padrão: dia atual)
- Escolha quantos meses analisar
- Visualize a média em abas: Diária, Semanal, Mensal

### 💰 Gerenciador de Despesas
- Clique em **"Gerenciador"** na sidebar
- Preencha o formulário:
  - **Descrição**: O que foi gasto (ex: "Compra de arroz")
  - **Valor**: Quanto custou em reais
  - **Data**: Quando foi a despesa
  - **Categoria**: Tipo de despesa
- Clique em **"Adicionar Despesa"**
- Veja seu histórico na tabela abaixo

## 📋 Exemplo de Uso Prático

### Você é dona de uma mercearia

**Dia 1: Registrar despesas**
1. Vá para "Gerenciador"
2. Adicione: "Compra de arroz - R$ 500 - 02/12/2024 - Alimentos"
3. Adicione: "Compra de feijão - R$ 300 - 02/12/2024 - Alimentos"
4. Adicione: "Conta de luz - R$ 200 - 05/12/2024 - Energia"

**Dia 2: Analisar tendências**
1. Vá para "Análise de Médias"
2. Selecione o dia **02** (quando você compra produtos)
3. Observe a **Média Diária** dos últimos 3 meses
4. Agora você sabe quanto gasta em média nesse dia!

## 🎨 Personalizar

### Adicionar Nova Categoria
1. Abra `src/components/ExpenseForm.tsx`
2. Encontre a linha: `const categories = ['Geral', 'Alimentos', ...]`
3. Adicione sua categoria: `const categories = ['Geral', 'Alimentos', 'Sua Categoria', ...]`
4. Salve e a página recarregará automaticamente

### Mudar as Cores
1. Abra `tailwind.config.ts`
2. Procure por:
```typescript
colors: {
  'blue-navy': '#001f3f',      // Azul marinho
  'yellow-burned': '#cc7a00',   // Amarelo queimado
}
```
3. Mude os códigos hexadecimais para as cores desejadas

## ⚙️ Comandos Úteis

```bash
# Desenvolvimento (com reload automático)
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Verificar erros/lint
npm run lint

# Limpar cache
npm run build --reset
```

## 🐛 Solução de Problemas

### Dados não aparecem
- Verifique se adicionou as despesas
- Abra DevTools (F12) > Application > Local Storage
- Procure pela chave `expenses`

### Cores estranhas
- Execute `npm run dev` novamente
- Limpe o cache do navegador (Ctrl+Shift+Delete)

### Datas em formato estranho
- Isso é normal, está em formato ISO (YYYY-MM-DD)
- A exibição mostra em formato brasileiro (DD/MM/YYYY)

### Média calculada errada
- Verifique se há dados para esses dias
- Domingos e feriados são excluídos automaticamente
- Se o dia for feriado, busca no mês anterior

## 💡 Dicas Importantes

✅ **Faça backup regularmente**: Os dados são salvos no navegador
- Se limpar cache/cookies, perde os dados
- Considere exportar para CSV futuramente

✅ **Use datas consistentes**: Sempre registre na data correta

✅ **Categorize bem**: Facilita análises futuras

✅ **Revise semanalmente**: Acompanhe as médias

## 📞 Suporte

Se encontrar problemas:
1. Recarregue a página (F5)
2. Limpe o cache (Ctrl+Shift+Delete)
3. Verifique o console (F12 > Console) para erros
4. Reinicie o servidor (`npm run dev`)

## 🎯 Próximos Passos

Depois de familiarizado:
- Analise as tendências de despesas
- Use os dados para prever gastos futuros
- Identifique dias com maiores despesas
- Otimize as compras com base nas médias

---

**Bom uso! 🎉**
