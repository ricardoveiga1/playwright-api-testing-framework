// Environment variables are loaded in globalSetup.ts
// No need to load dotenv here as it's handled by globalSetup based on TEST_ENV

const processENV = process.env.TEST_ENV
const env = processENV || 'prod' // default to 'prod' if TEST_ENV is not set
console.log('Test environment is: ' + env)

// command to run in terminal: TEST_ENV=qa npx playwright test tests/api-tests/smokeTest.spec.ts
// Default configuration for API tests
const config = {
    apiUrl: process.env.BASE_URL || 'https://conduit-api.bondaracademy.com/api',
    userEmail: process.env.USERNAME || 'pwapiuser@test.com',
    userPassword: process.env.PASSWORD || 'Welcome'
}

export {config}