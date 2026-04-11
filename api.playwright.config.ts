import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const processENV = process.env.TEST_ENV
const env = processENV || 'prod' // default to 'prod' if TEST_ENV is not set
console.log('Test environment is: ' + env)

// command to run in terminal: TEST_ENV=qa npx playwright test tests/api-tests/smokeTest.spec.ts
// Default configuration for API tests
const config = {
    apiUrl: process.env.BASE_URL as string,
    userEmail: process.env.USERNAME as string || 'pwapiuser@test.com',
    userPassword: process.env.PASSWORD as string || 'Welcome'
}

if(env === 'prod'){
    if (!process.env.USERNAME || !process.env.PASSWORD) {
        throw new Error('USERNAME and PASSWORD environment variables must be set for production environment');
    }
    config.userEmail = process.env.USERNAME as string
    config.userPassword = process.env.PASSWORD as string
}

export {config}