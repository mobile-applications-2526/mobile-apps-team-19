/// <reference types="cypress" />

// ***********************************************
// Custom commands for your application
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user
       * @example cy.login('johndoe', 'password123')
       */
      login(username: string, password: string): Chainable<void>;

      /**
       * Custom command to programmatically log in a user via API
       * @example cy.loginViaAPI('johndoe', 'password123')
       */
      loginViaAPI(username: string, password: string): Chainable<void>;

      /**
       * Custom command to sign up a new user
       * @example cy.signup('John', 'Doe', 'johndoe', 'john@example.com', 'password123')
       */
      signup(firstName: string, lastName: string, username: string, email: string, password: string): Chainable<void>;

      /**
       * Custom command to get element by data-testid
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Custom login command
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.wait(1000); // Wait for page to load
  
  cy.get('input[placeholder*="username"]', { timeout: 10000 }).should('be.visible').clear().type(username);
  cy.get('input[placeholder*="password"]').should('be.visible').clear().type(password);
  
  // Click the form submit button (the one below password field, not the header button)
  cy.get('input[placeholder*="password"]').parent().parent().parent().within(() => {
    cy.contains(/^Login$/i).click();
  });
  
  // Wait for navigation to complete - increased timeout
  cy.url().should('not.include', '/login', { timeout: 20000 });
  cy.wait(2000); // Additional wait for state to propagate
});

// Custom programmatic login via API
Cypress.Commands.add('loginViaAPI', (username: string, password: string) => {
  // Make API call to login
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/auth/login',
    body: {
      username: username,
      password: password
    }
  }).its('body').then((body) => {
    expect(body.token).to.exist;
    
    const userDataToSave = {
      token: body.token,
      username: body.username
    };
    
    // Visit the app first to establish the domain
    cy.visit('/');
    
    // Find the AsyncStorage key pattern and set it
    cy.window().then((win) => {
      // AsyncStorage in web uses localStorage with a prefix
      const keys = Object.keys(win.localStorage);
      let asyncStorageKey = keys.find(k => k.includes('loggedInUser'));
      
      if (!asyncStorageKey) {
        // If no existing key, create one with common pattern
        asyncStorageKey = '@RNAsyncStorage:loggedInUser';
      }
      
      win.localStorage.setItem(asyncStorageKey, JSON.stringify(userDataToSave));
    });
    
    // Reload to trigger auth check
    cy.reload();
    cy.wait(1000);
  });
});

// Custom signup command
Cypress.Commands.add('signup', (firstName: string, lastName: string, username: string, email: string, password: string) => {
  cy.visit('/signup');
  cy.wait(1000); // Wait for page to load
  cy.get('input[placeholder*="first name"]', { timeout: 10000 }).should('be.visible').clear().type(firstName);
  cy.get('input[placeholder*="last name"]').should('be.visible').clear().type(lastName);
  cy.get('input[placeholder*="username"]').first().should('be.visible').clear().type(username);
  cy.get('input[placeholder*="email"]').should('be.visible').clear().type(email);
  cy.get('input[placeholder*="password"]').should('be.visible').clear().type(password);
  // Look for "Sign Up" text
  cy.contains(/^Sign Up$/i).click();
  cy.wait(2000); // Wait for signup to process
});

// Custom command to get elements by test id
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

export {};
