# Gerenciador da Mercearia 

Este é um aplicativo web completo criado para ajudar a gerenciar as finanças de uma mercearia. Ele permite o registro de movimentos diários de caixa para cálculo de médias de faturamento e também possui um gerenciador de despesas e receitas.

O projeto foi construído com as tecnologias mais modernas para garantir uma experiência de usuário rápida, segura e amigável.

## Tecnologias Utilizadas

-   **Next.js**: Um framework React para construir aplicações web full-stack.
-   **TypeScript**: Adiciona tipagem estática ao JavaScript para um desenvolvimento mais robusto e com menos bugs.
-   **Tailwind CSS**: Um framework de CSS utility-first para criar designs modernos e responsivos rapidamente.
-   **Firebase (Firestore)**: Um banco de dados NoSQL em nuvem para armazenar os dados da aplicação de forma segura e em tempo real.

## Funcionalidades

-   **Cálculo de Médias de Faturamento**:
    -   Adicione o valor do movimento total do dia.
    -   Visualize automaticamente a média de faturamento para aquele dia específico do mês (com base no histórico), para a semana atual e para o mês atual.
    -   A interface exibe a data completa, incluindo o dia da semana, para fácil referência.

-   **Gerenciador de Despesas**:
    -   Adicione novas transações, classificando-as como "Receita" ou "Despesa".
    -   Categorize cada transação (ex: Salário, Aluguel, Fornecedores).
    -   Visualize o balanço total (Receitas, Despesas e Saldo Atual).
    -   Acesse um histórico completo de todas as transações, que pode ser removido individualmente.

## Configuração do Projeto

Siga os passos abaixo para rodar este projeto em sua máquina local.

### 1. Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
-   Uma conta no [Firebase](https://firebase.google.com/) com um projeto criado.

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
npm install
```

### 3. Configuração do Firebase

Para que o aplicativo se conecte ao seu banco de dados, você precisa fornecer suas chaves de API do Firebase.

1.  **Encontre suas credenciais**:
    -   Acesse o [console do Firebase](https://console.firebase.google.com/).
    -   Abra o seu projeto.
    -   Vá para **Configurações do Projeto** (clicando na engrenagem).
    -   Na aba **Geral**, role para baixo até a seção "Seus apps".
    -   Selecione ou crie um aplicativo da Web.
    -   Você verá um objeto de configuração `firebaseConfig`. É daqui que você irá copiar os valores.

2.  **Crie o arquivo de ambiente**:
    -   No diretório raiz do projeto, renomeie o arquivo `.env.local.example` para `.env.local`.
    -   Copie os valores do `firebaseConfig` e cole-os nas variáveis correspondentes dentro do arquivo `.env.local`:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="SUA_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="SEU_APP_ID"
    ```

### 4. Rodando a Aplicação

Com as dependências instaladas e as chaves do Firebase configuradas, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação funcionando.

## Comandos Úteis

-   `npm run dev`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Cria uma versão otimizada do projeto para produção.
-   `npm run start`: Inicia um servidor de produção (requer um `build` prévio).
-   `npm run lint`: Executa o linter para verificar a qualidade do código.
