// Dados de exemplo para testar a aplicação
// Copie esse código no console do navegador (F12 > Console) para carregar dados de teste

const SAMPLE_EXPENSES = [
  // Dezembro 2024
  { id: '1', description: 'Compra de produtos', amount: 1200, date: '2024-12-02', category: 'Alimentos' },
  { id: '2', description: 'Fornecedor - Bebidas', amount: 800, date: '2024-12-02', category: 'Fornecedor' },
  { id: '3', description: 'Energia', amount: 450, date: '2024-12-05', category: 'Energia' },
  { id: '4', description: 'Limpeza', amount: 150, date: '2024-12-10', category: 'Outros' },
  
  // Novembro 2024
  { id: '5', description: 'Compra produtos', amount: 1100, date: '2024-11-02', category: 'Alimentos' },
  { id: '6', description: 'Bebidas e refrigerantes', amount: 750, date: '2024-11-02', category: 'Fornecedor' },
  { id: '7', description: 'Conta de água', amount: 200, date: '2024-11-08', category: 'Energia' },
  { id: '8', description: 'Material de limpeza', amount: 120, date: '2024-11-12', category: 'Outros' },
  
  // Outubro 2024
  { id: '9', description: 'Abastecimento', amount: 1050, date: '2024-10-02', category: 'Alimentos' },
  { id: '10', description: 'Fornecedor principal', amount: 900, date: '2024-10-02', category: 'Fornecedor' },
  { id: '11', description: 'Energia elétrica', amount: 380, date: '2024-10-07', category: 'Energia' },
];

// Para carrega os dados de teste:
function loadSampleData() {
  // Converter datas string para Date objects
  const expenses = SAMPLE_EXPENSES.map(exp => ({
    ...exp,
    date: new Date(exp.date)
  }));
  
  localStorage.setItem('expenses', JSON.stringify(expenses));
  console.log('✅ Dados de teste carregados com sucesso!');
  console.log('Recarregue a página para ver os dados.');
  alert('Dados de teste carregados! Recarregue a página.');
}

// Executar: loadSampleData()
// Depois recarregue a página (F5)
