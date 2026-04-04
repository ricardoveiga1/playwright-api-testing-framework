const processENV = process.env.TEST_ENV
const env = processENV || 'qa' // default to 'qa' if TEST_ENV is not set
console.log('Test environment is: ' + env)

// command to run in terminal: TEST_ENV=qa npx playwright test tests/smokeTest.spec.ts
// Default configuration for API tests
const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'pwapiuser@test.com',
    userPassword: 'Welcome'
}

if(env === 'qa'){
    config.userEmail = 'pwapiuser@test.com',
    config.userPassword = 'Welcome'
}
if(env === 'prod'){
    config.userEmail = 'prod@test.com',
    config.userPassword = 'prod123'
}


export {config}