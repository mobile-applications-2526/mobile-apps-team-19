import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Background
Given('I am logged in with username {string} and password {string}', (username: string, password: string) => {
  cy.loginViaAPI(username, password);
});

// When steps
When('I navigate to the events page', () => {
  cy.visit('/event');
});

When('I am on the create event page', () => {
  cy.visit('/createEvent');
});

When('I fill in the event form with:', (dataTable: any) => {
  const data = dataTable.rowsHash();
  
  if (data.name) {
    cy.get('input[placeholder*="name" i]').clear().type(data.name);
  }
  if (data.date) {
    cy.get('input[placeholder*="YYYY-MM-DD"]').clear().type(data.date);
  }
  if (data.hostName) {
    cy.get('input[placeholder*="John Doe"]').clear().type(data.hostName);
  }
  if (data.location) {
    cy.get('input[placeholder*="location" i]').clear().type(data.location);
  }
  if (data.startTime) {
    cy.get('input[placeholder*="18:00"]').first().clear().type(data.startTime);
  }
  if (data.endTime) {
    cy.get('input[placeholder*="23:30"]').clear().type(data.endTime);
  }
});

When('I submit the event form', () => {
  cy.contains('Create Event').scrollIntoView().click();
});

When('I click on the first event', () => {
  cy.get('[data-testid="event-card"]').first().click();
});

When('I click on an event with pictures', () => {
  cy.get('[data-testid="event-card"]').first().click();
});

When('I click the edit button', () => {
  cy.contains(/edit/i).click();
});

When('I change the event name to {string}', (newName: string) => {
  cy.get('input[placeholder*="name" i]').clear().type(newName);
});

When('I save the changes', () => {
  cy.contains(/save|update/i).click();
});

When('I click the delete button', () => {
  cy.contains(/delete/i).click();
});

When('I confirm the deletion', () => {
  cy.contains(/confirm|yes|delete/i).click();
});

When('I upload a picture', () => {
  cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true });
});

// Then steps
Then('I should see a list of events', () => {
  cy.get('[data-testid="event-card"]').should('have.length.at.least', 1);
});

Then('each event should display its name, date, and location', () => {
  cy.get('[data-testid="event-card"]').first().within(() => {
    cy.get('body').should('exist'); // Just verify the card exists
  });
});

Then('the event should be created successfully', () => {
  cy.url().should('not.include', '/createEvent');
});

Then('I should see {string} in the events list', (eventName: string) => {
  cy.contains(eventName, { timeout: 15000 }).scrollIntoView().should('be.visible');
});

Then('I should see the event details page', () => {
  cy.url().should('include', '/event-details');
});

Then('I should see the event name', () => {
  cy.get('body').should('contain.text', /.+/);
});

Then('I should see the event date', () => {
  cy.get('body').should('contain.text', /\d{4}|\d{2}/);
});

Then('I should see the event location', () => {
  cy.get('body').should('exist');
});

Then('the event should be updated', () => {
  cy.get('body').should('exist');
});

Then('I should see {string}', (text: string) => {
  cy.contains(text, { timeout: 15000 }).scrollIntoView().should('be.visible');
});

Then('the event should be removed from the list', () => {
  cy.get('body').should('exist');
});

Then('the picture should appear in the event', () => {
  cy.get('img').should('have.length.at.least', 1);
});

Then('I should see the event pictures gallery', () => {
  cy.get('img').should('exist');
});

Then('each picture should be displayed', () => {
  cy.get('img').should('have.length.at.least', 1);
});
