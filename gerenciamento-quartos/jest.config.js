module.exports = {
    // Define onde o Jest deve procurar arquivos de teste
    testMatch: [
      '**/tests/**/*.test.js', // Testes dentro da pasta /tests
      '**/src/**/*.test.js', // Testes dentro da pasta /src
    ],
    // Define a configuração de setup global para os testes
    setupFilesAfterEnv: ['<rootDir>/src/setupTestes.js'],
    // Define o ambiente de teste
    testEnvironment: 'jsdom',
    // Adiciona suporte para imports de módulos
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    // Se necessário, ajuste para reconhecer arquivos com extensões diferentes
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  };
  