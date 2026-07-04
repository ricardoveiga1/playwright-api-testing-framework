import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll(async ({ request }) => {
    console.log('Starting API tests...');
    const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login',  {
        data: {
            "user": {
                "email": "pwapiuser@test.com",
                "password": "Welcome"
            }
        }
    })
    const tokenResponseJSON = await tokenResponse.json();
    //console.log(tokenResponseJSON);
    authToken = 'Token ' + tokenResponseJSON.user.token;
})

// test.afterAll(async ({ request }) => {
//     console.log('API tests completed.');
// })

test('Example API Test - GET tags', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagsResponseJSON = await response.json();

  expect(response.status()).toEqual(200);
  //console.log(tagsResponseJSON);

  expect(tagsResponseJSON).toHaveProperty('tags');
  expect(tagsResponseJSON.tags).toContain('YouTube');
  expect(tagsResponseJSON.tags[0]).toEqual('Test');
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);

  //console.log(tagsResponseJSON);

});

test('GET All Articles', async ({ request }) => {
    const articles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
    const articlesResponseJSON = await articles.json();
    expect(articles.status()).toEqual(200);
    //console.log(articlesResponseJSON);

    expect(articlesResponseJSON).toHaveProperty('articles');
    expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);

    //console.log(articlesResponseJSON);

});

test('Create  and Delete New Article', async ({ request }) => {

    // Create a new article
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        
        data: {
            "article": {
                "title": "Test TWO TEST",
                "description": "Ricardo Test",
                "body": "Test Body",
                "tagList": [
                    "Test"
                ]
            }
        } , 
        headers: {
            Authorization: authToken
        },     
    });
    const newArticleResponseJSON = await newArticleResponse.json();
    //console.log(newArticleResponseJSON);

    expect(newArticleResponse.status()).toEqual(201);
    expect(newArticleResponseJSON.article.title).toEqual("Test TWO TEST");
    const articleSlug = newArticleResponseJSON.article.slug;


    // Verify the new article
    const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
        headers: {
            Authorization: authToken
        }
    });
    const articleResponseJSON = await articleResponse.json();
    //console.log(articleResponseJSON);
    expect(articleResponse.status()).toEqual(200);
    expect(articleResponseJSON.articles[0].title).toEqual("Test TWO TEST");

    // Delete the article
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
        headers: {
            Authorization: authToken
        }
    });
    expect(deleteArticleResponse.status()).toEqual(204);
});

test('Create, Update and Delete New Article', async ({ request }) => {

    // Create a new article
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        
        data: {
            "article": {
                "title": "Test NEW ARTICLE TEST",
                "description": "Ricardo Test",
                "body": "Test Body",
                "tagList": [
                    "Test"
                ]
            }
        } , 
        headers: {
            Authorization: authToken
        },     
    });
    const newArticleResponseJSON = await newArticleResponse.json();
    //console.log(newArticleResponseJSON);

    expect(newArticleResponse.status()).toEqual(201);
    expect(newArticleResponseJSON.article.title).toEqual("Test NEW ARTICLE TEST");
    const articleSlug = newArticleResponseJSON.article.slug;

    // Update the article
    const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
        data: {
            "article": {
                "title": "Test NEW ARTICLE TEST UPDATED",
                "description": "Ricardo Test UPDATED",
                "body": "Test Body UPDATED",
                "tagList": [
                    "Test"
                ]
            }
        } ,
        headers: {
            Authorization: authToken
        },     
    });
    const updateArticleResponseJSON = await updateArticleResponse.json();
    //console.log(updateArticleResponseJSON);

    expect(updateArticleResponse.status()).toEqual(200);
    expect(updateArticleResponseJSON.article.title).toEqual("Test NEW ARTICLE TEST UPDATED");
    const newSlugId = updateArticleResponseJSON.article.slug;


    // Verify the updated article
    const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
        headers: {
            Authorization: authToken
        }
    });
    const articleResponseJSON = await articleResponse.json();
    //console.log(articleResponseJSON);
    expect(articleResponse.status()).toEqual(200);
    expect(articleResponseJSON.articles[0].title).toEqual("Test NEW ARTICLE TEST UPDATED");

    // Delete the article
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {
        headers: {
            Authorization: authToken
        }
    });
    expect(deleteArticleResponse.status()).toEqual(204);
    console.log(`Article with slug ${newSlugId} deleted successfully.`);
});