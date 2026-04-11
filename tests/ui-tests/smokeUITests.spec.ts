import { test, expect, request } from '@playwright/test';


test('create article', async ({ page, request}) => {
    await page.goto('https://conduit.bondaracademy.com')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.USERNAME!)
    await page.getByRole('textbox', {name: 'Password'}).fill(process.env.PASSWORD! )
    await page.getByRole( 'button', {name: 'Sign in' }) .click()

    await page.getByText ('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title' }).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright') 
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwaright for tests!')
    await page.getByRole('button', {name: 'Publish Article'}).click()
    await expect(page.locator('.article-page h1')). toContainText ('Playwright is awesome')
    await page.getByText('Home').first().click()
    await page.getByText('Global Feed').click()

    await page.getByText('Playwright is awesome').click()
    await page.getByRole('button', {name: "Delete Article"}).first().click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('This')

})
