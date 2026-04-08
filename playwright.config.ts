import { defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1, // as melhores práticas é usar apenas 1 worker
  reporter: [['html'], ['list']],
  use: { // geralmente não utilizamos em projetos reais
    // extraHTTPHeaders: {
    //   'Authorization': 'Token aknsdsd23e3,  // utilizando aqui no use, não consigo remover dos demais requests, todo request terá esse header
    // },
    // httpCredentials: {
    //   username: '',
    //   password: ''
    // }
  },

  projects: [
    {
      name: 'api-testing',
      testMatch: 'example*',
      dependencies: ['smoke-tests'], // aqui estamos definindo que os testes de api-testing dependem dos testes de smoke-tests, ou seja, os testes de smoke-tests vão rodar primeiro, e se eles falharem, os testes de api-testing não vão rodar, garantindo que os testes de api-testing só rodem se os testes de smoke-tests passarem, e assim, podemos garantir que a API está funcionando antes de rodar os testes mais complexos de api-testing
    //   use: { 
    //     extraHTTPHeaders: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    },
    {
      name: 'smoke-tests',
      testMatch: 'smoke*', // todos que possuem smoke no nome, ou seja, smokeTest.spec.ts, smokeTest2.spec.ts, etc // npx playwright test --project smoke-tests
    },
   
  ],
});
