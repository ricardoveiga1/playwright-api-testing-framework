// import { expect } from '../utils/custom-exptect';
//import { test, expect } from '@playwright/test';
//import { RequestHandler } from '../utils/request-handler';  
import { test } from '../utils/fixtures'; // foi importado tudo na fixture, sem necessidade de improtar no teste
import { expect } from '@playwright/test' 

let authToken: string

test.beforeAll('Get Token', async ({ api }) => {
    const tokenResponse = await api
        .path('/users/login')
        .body({ "user": { "email": "pwapiuser@test.com", "password": "Welcome" } })
        .postRequest(200)
        //console.log(tokenResponse.json())
    authToken = `Token ${tokenResponse.user.token}`
    console.log(authToken)
    expect(authToken).toBeTruthy()
})

test('first test', async ({ api }) => { // precisamos passar contexto do api que está na fixture para acessar
    //const api = new RequestHandler()

    const response = await api
        //.url('https://conduit-api.bondaracademy.com/api')
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //.headers({ Authorization: 'authToken' })
        //.body({ "user": {"email": "user@example.com", "password": "Welcome"} })
        //.getUrl()
        .getRequest(200)
        console.log(response)

        expect(response.articles.length).toBeLessThanOrEqual(10)
        expect(response.articlesCount).toEqual(10)
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
        console.log(response)
        expect(response.tags[0]).toEqual('Test')
        expect(response.tags.length).toBeLessThanOrEqual(10)
})


test('Create and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "Test TWO TEST", "description": "Test description", "body": "Test body", "tagList": [] } })
        .headers({ Authorization: authToken })
        .postRequest(201)
    //await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual('Test TWO TEST')
    const slugId = createArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponse.articles[0].title).shouldEqual('Test TWO TEST')

    await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual('Test TWO TEST')
})

test('Create. Update and Delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .body({ "article": { "title": "Test TWO TEST", "description": "Test description", "body": "Test body", "tagList": [] } })
        .headers({ Authorization: authToken })
        .postRequest(201)
    //await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual('Test TWO TEST')
    const slugId = createArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponse.articles[0].title).shouldEqual('Test TWO TEST')

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body({ "article": { "title": "Test TWO TEST UPDATED", "description": "Test description", "body": "Test body", "tagList": [] } })
        .headers({ Authorization: authToken })
        .putRequest(200)
    //await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles')
    expect(updateArticleResponse.article.title).shouldEqual('Test TWO TEST UPDATED')
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
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articlesResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: authToken })
        .getRequest(200)
    //await expect(articlesResponseTwo).shouldMatchSchema('articles', 'GET_articles')
    expect(articlesResponseTwo.articles[0].title).not.shouldEqual('Test TWO TEST UPDATED')
})