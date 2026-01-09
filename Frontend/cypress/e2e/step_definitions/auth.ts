import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background steps
Given('I am on the login page', () => {
  cy.visit('/login');
  cy.url().should('include', '/login');
  cy.wait(1000); // Wait for page to fully load
});

Given('I am on the signup page', () => {
  cy.visit('/signup');
  cy.url().should('include', '/signup');
});

Given('I am logged in as {string} with password {string}', (username: string, password: string) => {
  cy.loginViaAPI(username, password);
});

// When steps
When('I enter username {string}', (username: string) => {
  cy.get('input[placeholder*="username" i]').clear().type(username);
});

When('I enter password {string}', (password: string) => {
  cy.get('input[placeholder*="password" i]').first().clear().type(password);
});

When('I enter signup password {string}', (password: string) => {
  cy.get('input[placeholder*="password" i]').clear().type(password);
});

When('I click the login button', () => {
  cy.wait(500);
  // Find the login button within the form container (below password field)
  cy.get('input[placeholder*="password"]').parent().parent().parent().within(() => {
    cy.contains(/^Login$/i, { timeout: 15000 }).scrollIntoView().should('be.visible').click();
  });
  cy.wait(1000); // Wait for async operations
});

When('I click the signup button', () => {
  cy.wait(500);
  cy.contains(/^Sign Up$/i).click();
});

When('I click the login button without entering credentials', () => {
  cy.contains(/^Login$/i).click();
});

When('I click the signup link', () => {
  cy.contains(/sign up/i).click();
});

When('I enter first name {string}', (firstName: string) => {
  cy.get('input[placeholder*="first name" i]').clear().type(firstName);
});

When('I enter last name {string}', (lastName: string) => {
  cy.get('input[placeholder*="last name" i]').clear().type(lastName);
});

When('I enter email {string}', (email: string) => {
  cy.get('input[placeholder*="email" i]').clear().type(email);
});

When('I navigate to settings', () => {
  // Assuming settings is accessible from a nav/menu
  cy.contains(/settings/i).click();
});

When('I click the logout button', () => {
  cy.contains(/logout/i).click();
});

// Then steps
Then('I should be redirected to the home page', () => {
  cy.url().should('not.include', '/login', { timeout: 15000 });
  cy.url().should('not.include', '/signup', { timeout: 15000 });
  cy.url().should('match', /\/(event|$)/, { timeout: 15000 });
});

Then('I should not see the login page', () => {
  cy.url().should('not.include', '/login', { timeout: 15000 });
});

Then('I should be on the signup page', () => {
  cy.url().should('include', '/signup');
});

Then('I should be redirected to the login page', () => {
  cy.url().should('include', '/login');
});
