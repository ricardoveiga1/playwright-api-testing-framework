import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';
import { validateSchema } from './schema-validator';
// https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend
// Essa classe é um exemplo de como criar matchers personalizados para o expect do Playwright, 
// para adicionar mais informações de contexto, como os logs das requisições e respostas da API, 
// para facilitar a identificação de erros nos testes. 
// A função setCustomExpectLogger é usada para passar a instância do APILogger para o custom expect, 
// para que ele possa acessar os logs recentes e incluir nas mensagens de erro dos matchers personalizados. 
// Assim, quando um matcher personalizado falhar, ele vai mostrar a mensagem de erro personalizada, 
// junto com os logs recentes da API, para ajudar na identificação do problema.

let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger
}

// aqui estamos estendendo o expect do Playwright para adicionar novos matchers personalizados, como shouldEqual, shouldBeLessThanOrEqual, e shouldMatchSchema, que são usados nos testes para validar as respostas da API, e incluir os logs recentes da API nas mensagens de erro, para facilitar a identificação de problemas nos testes.
declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T>{
            shouldEqual(expected: T): R
            shouldBeLessThanOrEqual(expected: T): R
            shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?: boolean): Promise<R>
        }
    }
}

export const expect = baseExpect.extend({
    async shouldMatchSchema(received: any, dirName: string, fileName: string, createSchemaFlag: boolean = false) {
        let pass: boolean;
        let message: string = ''
        

        try {
            await validateSchema(dirName, fileName, received, createSchemaFlag)
            pass = true;
            message = 'Schema validation passed'
        } catch (e: any) {
            pass = false;
            const logs = apiLogger.getRecentLogs()
            message = `${e.message}\n\nRecent API Activity: \n${logs}`
        }

        return {
            message: () => message,
            pass
        };
    },
    shouldEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string = ''

        try {
            baseExpect(received).toEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = apiLogger.getRecentLogs()
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs()
        }

        const hint = this.isNot ? 'not' : ''
        const message = this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `Recent API Activity: \n${logs}`

        return {
            message: () => message,// a função message é uma função que retorna a mensagem de erro personalizada, que inclui os logs recentes da API, para ajudar na identificação do problema, e o pass é um booleano que indica se o matcher passou ou falhou.
            pass
        };
    },
    shouldBeLessThanOrEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string = ''

        try {
            baseExpect(received).toBeLessThanOrEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = apiLogger.getRecentLogs()
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs()
        }

        const hint = this.isNot ? 'not' : ''
        const message = this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `Recent API Activity: \n${logs}`

        return {
            message: () => message,
            pass
        };
    }
})