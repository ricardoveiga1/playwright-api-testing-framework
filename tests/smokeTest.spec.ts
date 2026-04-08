// import { expect } from '../utils/custom-exptect';
//import { test, expect } from '@playwright/test';
//import { RequestHandler } from '../utils/request-handler';  
import { test } from '../utils/fixtures'; // foi importado tudo na fixture, sem necessidade de improtar no teste
//import { expect } from '@playwright/test' 
import { expect } from '../utils/custom-expect' // importando o expect personalizado, que inclui os logs recentes da API nas mensagens de erro, para facilitar a identificação de problemas nos testes. Assim, quando um matcher personalizado falhar, ele vai mostrar a mensagem de erro personalizada, 
// junto com os logs recentes da API, para ajudar na identificação de problemas nos testes. O expect personalizado é configurado para acessar a instância do APILogger, que é passada na fixture, para acessar os logs recentes da API e incluir nas mensagens de erro dos matchers personalizados. Dessa forma, podemos ter mais contexto sobre o que aconteceu na API antes do erro ocorrer no teste, o que facilita a identificação do problema e a correção do teste ou da API
import { APILogger } from '../utils/logger';
import { createToken } from '../helpers/createToken';
import { validateSchema } from '../utils/schema-validator';
import articleRequestPayload from '../request-objects/POST-article.json'

let authToken: string

// test.beforeAll('Get Token', async ({ api, config }) => {
//     const tokenResponse = await api
//         .path('/users/login')
//         //.body({ "user": { "email": "pwapiuser@test.com", "password": "Welcome" } })
//         .body({ "user": { "email": config.userEmail, "password": config.userPassword } })
//         .postRequest(200)
//         //console.log(tokenResponse.json())
//     authToken = `Token ${tokenResponse.user.token}`
//     //console.log(authToken)
//     console.log('Token obtained successfully')
//     expect(authToken).toBeTruthy()
// })

//PREFIRO UTILIZAR ESTE BEFOREALL PARA OBTER O TOKEN DE AUTENTICAÇÃO, DO JEITO QUE ESTÁ, FOI DEFINIDO NA FIXTURE E FEITO UM CLEAR FIELDS NA FUNÇÃO DE GET, POST, PUT E DELETE, -> BASTA REMOVER ESSA LÓGIA E FAZER NO BEFOREALL
// test.beforeAll('Get Token', async ({ config }) => {
//     authToken = await createToken(config.userEmail, config.userPassword)
//     console.log(authToken)
// })

// Aqui estamos fazendo um override em cima do  do authtoken padrão, ou seja, um token de um usuário 
test.beforeAll('Get Token', async ({ config }) => {
    authToken = await createToken('pwtest@test.com', 'Welcome2')
    console.log(authToken)
})

test('logger test', async ({  }) => {
    const logger = new APILogger()
    const logger2 = new APILogger()
    logger.logRequest('POST', 'https://test.com/api', { Authorization: 'token'}, { foo: 'bar' })
    logger.logResponse(200, { foo: 'bar' })
    const logs = logger.getRecentLogs()

    logger2.logRequest('GET', 'https://test.com/api/123', { Authorization: 'token'}, { foo: 'bar' })
    logger2.logResponse(200, { foo: 'bar' })
    const logs2 = logger2.getRecentLogs()

    console.log(logs)
    console.log(logs2)
})

test.only('Get articles', async ({ api }) => { // precisamos passar contexto do api que está na fixture para acessar
    //const api = new RequestHandler()

    const response = await api
        //.url('https://conduit-api.bondaracademy.com/api')
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //.headers({ Authorization: 'authToken' })
        //.headers({ Authorization: authToken })
        //.body({ "user": {"email": "user@example.com", "password": "Welcome"} })
        //.getUrl()
        //.clearAuth() // sem limpar o auth token tem 11 artigos, limpando, temos 10 que são por padrão, usandoi befora all o token será de outro user
        .getRequest(200)
        //console.log(response)

        expect(response.articles.length).toBeLessThanOrEqual(10)
        expect(response.articlesCount).shouldEqual(10)
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
        //console.log(response)
        //await validateSchema('tags', 'GET_tags', response)
        await expect(response).shouldMatchSchema('tags', 'GET_tags', true)// passando true gera o schema automaticamente 
        expect(response.tags[0]).shouldEqual('Test')
        expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test('Testing clearfields', async ({ api }) => { 
    //veremos que o header do primeiro request não vai ser enviado no segundo request, por conta do clearfields, que limpa o token de autenticação do segundo request, e assim, podemos testar a funcionalidade de limpar os campos da requisição, para garantir que os campos não sejam enviados em requisições subsequentes, caso não sejam necessários, ou para testar cenários de autenticação negativa, onde o token de autenticação é removido para testar a resposta da API quando um token inválido ou ausente é enviado. Dessa forma, podemos garantir que a funcionalidade de limpar os campos da requisição esteja funcionando corretamente e que a API esteja respondendo conforme o esperado em cenários de autenticação negativa.

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

        expect(response.articles.length).shouldBeLessThanOrEqual(10)
        expect(response.articlesCount).shouldEqual(10)

        const response2 = await api
        .path('/tags')
        .getRequest(200)
        expect(response2.tags[0]).shouldEqual('Test')
        expect(response2.tags.length).shouldBeLessThanOrEqual(5)
})


test('Create and Delete Article', async ({ api }) => {

    const newTitle = articleRequestPayload.article.title = 'This is an object title' // aqui estamos setando o título do artigo dinamicamente, para garantir que o título seja único e evitar conflitos com artigos existentes, caso o teste seja execut

    console.log('Article title set to: ' + newTitle)
    // Check if article with this title already exists and delete it to avoid conflicts
    const searchKeywords = ['This', 'object', 'title']
    const articlesListResponse = await api
        .path('/articles')
        //.headers({ Authorization: authToken })
        .getRequest(200)
    
    // Find and delete existing article with slug containing all keywords
    const existingArticle = articlesListResponse.articles.find((article: any) => 
        searchKeywords.every(keyword => article.slug.includes(keyword))
    )
    if (existingArticle) {
        await api
            .path(`/articles/${existingArticle.slug}`)
            //.headers({ Authorization: authToken })
            .deleteRequest(204)
        console.log(`Deleted existing article with slug: ${existingArticle.slug}`)
    } else {
        console.log('No existing article found, proceeding with creation')
    }
    
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequestPayload)
        //.headers({ Authorization: authToken })
        .postRequest(201)
    //await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual(newTitle)
    const slugId = createArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //.headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponse.articles[0].title).shouldEqual(newTitle)

    await api
        .path(`/articles/${slugId}`)
        //.headers({ Authorization: authToken })
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //.headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(newTitle)
})

test('Create. Update and Delete Article', async ({ api }) => {

    //evita que em testes executados em paralelo, ou em execuções múltiplas, tenhamos conflitos de dados, ou seja, tentamos criar um artigo com um título que já existe, o que pode causar falhas nos testes, ou resultados inconsistentes. Dessa forma, garantimos que cada execução do teste tenha um ambiente limpo e controlado, evitando conflitos de dados e garantindo a confiabilidade dos testes ao longo do tempo.
    const articleNewInstanceRequestPayload = JSON.parse(JSON.stringify(articleRequestPayload)) // aqui estamos criando uma nova instância do payload de criação de artigo, para evitar que as alterações feitas no teste anterior afetem este teste, garantindo que cada teste tenha seu próprio payload independente, e assim, podemos garantir que os testes sejam isolados e não tenham efeitos colaterais entre si, o que é uma boa prática em testes automatizados para garantir a confiabilidade e a manutenção dos testes ao longo do tempo.
    articleNewInstanceRequestPayload.article.title = 'This is an object title for update' // aqui estamos setando o título do artigo dinamicamente, para garantir que o título seja único e evitar conflitos com artigos existentes, caso o teste seja executado várias vezes, ou em paralelo, garantindo que cada execução do teste tenha um título de artigo único, o que ajuda a evitar conflitos e garantir a confiabilidade dos testes.

    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequestPayload)
        //.headers({ Authorization: authToken })
        .postRequest(201)
    //await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual(articleRequestPayload.article.title)
    const slugId = createArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //.headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponse.articles[0].title).shouldEqual(articleRequestPayload.article.title)

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body(articleNewInstanceRequestPayload)
        //.headers({ Authorization: authToken })
        .putRequest(200)
    //await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles')
    expect(updateArticleResponse.article.title).shouldEqual(articleNewInstanceRequestPayload.article.title)
    const newSlugId = updateArticleResponse.article.slug

    // const newArticlesResponse = await api
    //     .path('/articles')
    //     .params({ limit: 10, offset: 0 })
    //     .headers({ Authorization: authToken })
    //     .getRequest(200)
    // expect(newArticlesResponse.articles[0].title).shouldEqual('Test TWO TEST UPDATED')
    // const newSlugId = newArticlesResponse.articles[0].slug

    await api
        .path(`/articles/${newSlugId}`)
        //.headers({ Authorization: authToken })
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //.headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleNewInstanceRequestPayload.article.title)
})