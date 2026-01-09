// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can change the location of this file or turn off automatically serving
// support files with the 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Auto-accept all window alerts and confirms
Cypress.on('window:before:load', (win) => {
  cy.stub(win, 'alert').as('windowAlert');
  cy.stub(win, 'confirm').returns(true).as('windowConfirm');
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
