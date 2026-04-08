import articleRequestPayload from '../request-objects/POST-article.json'
import { faker } from '@faker-js/faker';

export function generateNewRandomArticle() {
    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    articleRequest.article.title = faker.lorem.sentence(5) // substituindo title do payload
    articleRequest.article.description = faker.lorem.sentence(3) // substituindo description do payload
    articleRequest.article.body = faker.lorem.paragraphs(3) // substituindo body do payload
    return articleRequest
}