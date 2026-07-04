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

const env = process.env.TEST_ENV
let globTimeout: number = 1000 * 60 * 5 // 5 minute default
if (env == 'prod') {
  globTimeout = 1000 * 60 * 1 // 1 minute
}
export { globTimeout }

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1, // as melhores práticas é usar apenas 1 worker
  reporter: [['html', {open: 'never', inlineImages: true}], ['list']],
  use: { // geralmente não utilizamos em projetos reais
    //baseURL: 'https://conduit.bondaracademy.com', // aqui estamos definindo a baseURL para todos os testes, ou seja, quando utilizarmos page.goto('/'), ele vai entender que é https://conduit.bondaracademy.com/, e assim, podemos evitar de repetir a URL completa em todos os testes, e também, se a URL mudar, basta mudar aqui, e não em todos os testes, o que facilita a manutenção dos testes
    trace: 'retain-on-failure' // para reter o trace apenas quando o teste falhar, ou seja, se o teste passar, não vai gerar o trace, economizando espaço em disco e facilitando a análise dos testes que falharam, já que só teremos o trace dos testes que realmente precisam de análise, e não de todos os testes, o que pode ser muito útil em projetos com muitos testes, onde gerar o trace de todos os testes pode ser inviável e desnecessário
    // extraHTTPHeaders: {
    //   'Authorization': 'Token aknsdsd23e3,  // utilizando aqui no use, não consigo remover dos demais requests, todo request terá esse header
    // },
    // httpCredentials: {
    //   username: '',
    //   password: ''
    // }
    
  },
  timeout: globTimeout,
  expect: {
    timeout: globTimeout,
  },
  globalSetup: './utils/globalSetup.ts',

  projects: [
    {
      name: 'api-testing',
      testDir: './tests/api-tests',
      testMatch: 'negative*',
      dependencies: ['api-smoke-tests'], // aqui estamos definindo que os testes de api-testing dependem dos testes de smoke-tests, ou seja, os testes de smoke-tests vão rodar primeiro, e se eles falharem, os testes de api-testing não vão rodar, garantindo que os testes de api-testing só rodam se os testes de smoke-tests passarem, e assim, podemos garantir que a API está funcionando antes de rodar os testes mais complexos de api-testing
    },
    {
      name: 'api-smoke-tests',
      use: { baseURL: process.env.BASE_URL},
      testDir: './tests/api-tests',
      testMatch: 'smoke*', // todos que possuem smoke no nome, ou seja, smokeTest.spec.ts, smokeTest2.spec.ts, etc // npx playwright test --project api-smoke-tests
    },
    {
      name: 'api-example-tests',
      use: { baseURL: process.env.BASE_URL },
      testDir: './tests/api-tests',
      testMatch: '*example*', // todos que possuem example no nome, ou seja, exampleTest.spec.ts, exampleTest2.spec.ts, etc // npx playwright test --project api-example-tests
    },
    {
      name: 'ui-tests',
      testDir: './tests/ui-tests',
      use: {
        baseURL: process.env.BASE_URL,
        defaultBrowserType: 'chromium',
        headless: false
      }
    }   
  ],
});
