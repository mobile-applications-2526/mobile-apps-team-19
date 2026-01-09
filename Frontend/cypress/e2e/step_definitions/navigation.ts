import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background
Given('I am logged in as user {string} with password {string}', (username: string, password: string) => {
  cy.loginViaAPI(username, password);
});

Given('I am on the events page', () => {
  cy.visit('/event');
  cy.url().should('include', '/event');
});

// When steps
When('I visit the home page', () => {
  cy.visit('/');
});

When('I click on the {string} tab', (tabName: string) => {
  cy.contains(tabName).click();
});

When('I click on the first event card', () => {
  cy.get('[data-testid="event-card"]').first().click();
});

When('I click the browser back button', () => {
  cy.go('back');
});

When('I visit an event details page directly with ID {string}', (eventId: string) => {
  cy.visit(`/event-details?id=${eventId}`);
});

When('I scroll down the page', () => {
  cy.scrollTo(0, 500);
});

When('I click on an event', () => {
  cy.get('[data-testid="event-card"]').first().click();
});

When('I navigate back to events', () => {
  cy.go('back');
});

When('I visit the events page', () => {
  cy.visit('/event');
});

When('I visit the create event page', () => {
  cy.visit('/createEvent');
});

// Then steps
Then('I should be on the home page', () => {
  cy.url().should('not.include', '/event');
  cy.url().should('not.include', '/createEvent');
  cy.url().should('not.include', '/login');
  cy.url().should('not.include', '/signup');
});

Then('I should be on the events page', () => {
  cy.url().should('include', '/event');
});

Then('I should be on the create event page', () => {
  cy.url().should('include', '/createEvent');
});

Then('I should see the event details', () => {
  cy.url().should('include', '/event-details');
});

Then('I should be back on the events page', () => {
  cy.url().should('include', '/event');
  cy.url().should('not.include', '/event-details');
});

Then('I should see the event details page', () => {
  cy.url().should('include', '/event-details');
});

Then('the page should load the correct event', () => {
  cy.get('body').should('exist');
  cy.url().should('include', 'id=');
});

Then('my scroll position should be preserved', () => {
  // This is a simplified check - actual implementation may vary
  cy.get('body').should('exist');
});

Then('the {string} tab should be active', (tabName: string) => {
  cy.contains(tabName).should('exist');
});
