import { test as base } from '@playwright/test';  // test aqui é um alias para o test do Playwright, para evitar conflitos com o test que estamos criando
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-exptect';
import { config } from '../api-test.config';
import { createToken } from '../helpers/createToken';

// para criar uma fixture personalizada, precisamos usar o método extend do test do Playwright, passando um objeto com as propriedades que queremos adicionar à fixture, e a função que vai criar a instância da fixture, e passar o token de autenticação para os testes, usando o scope 'worker' para que o token seja criado apenas uma vez por worker, e não para cada teste. Assim, podemos acessar a instância do RequestHandler e do APILogger em todos os testes, sem precisar criar uma nova instância para cada teste.
export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export type WorkerFixture = {
    authToken: string
}

// fixture nativa do playwright, sem usar pagemanager e herança nas classes, para criar uma instância do RequestHandler e do APILogger, e passar o token de autenticação para os testes
export const test = base.extend<TestOptions, WorkerFixture>({

    authToken: [ async ({}, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword)
        await use(authToken)
    }, {scope: 'worker'}], 

    api: async({request, authToken}, use) => {
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        //criando instancia RequestHandle, building framework
        //const baseUrl = config.apiUrl // aqui podemos configurar a baseUrl para cada teste, ou usar a defaultBaseUrl definida no construtor da classe, que pode ser configurada na fixture para cada teste ou usar o valor padrão para todos os testes, definido na api-test.config.ts
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken)
        await use(requestHandler)
    },

    config: async({}, use) => {
        await use(config)
    }
})