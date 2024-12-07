# Instalação e Configuração do Projeto

Este guia fornece instruções passo a passo para instalar, configurar, testar e estender o projeto em sua máquina local.

## Pré-requisitos

Certifique-se de ter o seguinte software instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v14.x ou superior)
- [npm](https://www.npmjs.com/) (normalmente instalado automaticamente com o Node.js)
- Um editor de código (recomendado: [Visual Studio Code](https://code.visualstudio.com/))

## Passos

### 1. Clone o Repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/JorgeBeeck/projeto_aplicado_reserva_de_quartos.git
```

### 2. Navegue até o Diretório do Projeto

Entre no diretório do projeto:

```bash
cd projeto_aplicado_reserva_de_quartos
```

### 3. Instale as Dependências do Projeto

Instale todas as dependências necessárias:

```bash
npm install
```

### 4. Configure o Firebase

- Certifique-se de ter acesso ao projeto Firebase e obtenha suas credenciais.
- Crie um arquivo `firebase-config.js` na raiz do projeto e adicione suas configurações Firebase conforme o exemplo abaixo:

  ```javascript
  // firebase-config.js
  import { initializeApp } from 'firebase/app';
  import { getFirestore } from 'firebase/firestore';

  const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db };
  ```

### 5. Execute o Projeto

Inicie o servidor de desenvolvimento e abra a aplicação no seu navegador:

```bash
npm start
```

O aplicativo será iniciado em `http://localhost:3000`.

### 6. Teste a Aplicação

Abra o navegador e acesse `http://localhost:3000`. Você será redirecionado para a página de login. Faça login com uma conta válida para testar a aplicação.

### 7. Executar Testes

Para rodar os testes do projeto, utilize o seguinte comando:

```bash
npm test
```

Isso executará os testes configurados no projeto.

## Criar uma Nova Página

Para criar uma nova página, siga estes passos:

1. **Crie um novo componente React**: Adicione um novo arquivo na pasta `src/pages` (ou em uma pasta similar) com o nome da sua página, por exemplo, `NovaPagina.js`.

   ```javascript
   // src/pages/NovaPagina.js
   import React from 'react';

   const NovaPagina = () => {
     return (
       <div>
         <h1>Nova Página</h1>
         <p>Conteúdo da nova página.</p>
       </div>
     );
   };

   export default NovaPagina;
   ```

2. **Adicione uma rota para a nova página**: Atualize seu arquivo de rotas, geralmente localizado em `src/App.js` ou similar.

   ```javascript
   // src/App.js
   import React from 'react';
   import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
   import NovaPagina from './pages/NovaPagina';

   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/nova-pagina" element={<NovaPagina />} />
           {/* Outras rotas */}
         </Routes>
       </Router>
     );
   }

   export default App;
   ```

## Criar um Novo Teste

Para criar um novo teste para seu componente, siga estes passos:

1. **Crie um arquivo de teste**: Adicione um novo arquivo de teste na pasta `src/tests` (ou similar) com o nome do componente que está testando, por exemplo, `NovaPagina.test.js`.

   ```javascript
   // src/tests/NovaPagina.test.js
   import React from 'react';
   import { render, screen } from '@testing-library/react';
   import NovaPagina from '../pages/NovaPagina';

   test('deve renderizar a nova página', () => {
     render(<NovaPagina />);
     expect(screen.getByText(/Nova Página/i)).toBeInTheDocument();
     expect(screen.getByText(/Conteúdo da nova página./i)).toBeInTheDocument();
   });
   ```

2. **Execute os testes**: Rodar o comando `npm test` executará todos os testes, incluindo o novo que você adicionou.

## Suporte

Se você encontrar algum problema durante a instalação, configuração ou execução do projeto, sinta-se à vontade para entrar em contato com jorge gabriel beeck borges para obter ajuda.