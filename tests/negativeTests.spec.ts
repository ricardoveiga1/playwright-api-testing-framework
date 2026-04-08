import { test} from '../utils/fixtures';
import { expect } from '../utils/custom-expect';

// data driven test for username validation during user creation
[ 
    { username: 'dd', usernameErrorMessage: 'is too short (minimum is 3 characters)' },
    { username: 'ddd', usernameErrorMessage: '' },
    { username: 'dddddddddddddddddddd', usernameErrorMessage: '' },
    { username: 'ddddddddddddddddddddd', usernameErrorMessage: 'is too long (maximum is 20 characters)' },
   
].forEach(({ username, usernameErrorMessage }) => {
    // é necessário usar essa variável porque se não o compilador entende que iremos executar memso teste 4 vezes e não permite executar
    test(`Create user with username: ${username} should return error: ${usernameErrorMessage}`, async ({ api }) => {
        const userRequest = {
            user: {
                username: username,
                email: 'd',
                password: 'd'
            }
        }

        const response = await api
            .path('/users')
            .body(userRequest)
            .clearAuth()
            .postRequest(422)

        if(username.length == 3 || username.length == 20) {
            expect(response.errors).not.toHaveProperty('username')
        } else {
            expect(response.errors.username[0]).shouldEqual(usernameErrorMessage)
        }

        //expect(response.errors.username[0]).shouldEqual(usernameErrorMessage)
        console.log(response)
    })
})