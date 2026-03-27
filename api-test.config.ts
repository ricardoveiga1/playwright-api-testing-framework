const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log('Test environment is: ' + env)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'templateapiuser@xyz.com',
    userPassword: 'Welcome'
}

if(env === 'qa'){
    config.userEmail = '',
    config.userPassword = ''
}
if(env === 'prod'){
    config.userEmail = '',
    config.userPassword = ''
}


export {config}