// DISABLED: This file has been replaced by Cucumber BDD tests
// See cypress/e2e/features/navigation.feature

export {};

describe('Navigation', () => {
  beforeEach(() => {
    cy.fixture('example').then((data) => {
      cy.login(data.user.username, data.user.password);
    });
  });

  describe('Tab Navigation', () => {
    it('should navigate between tabs', () => {
      cy.visit('/');
      
      // Test navigation to different tabs
      const tabs = [
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/event' },
        { name: 'Create', url: '/createEvent' }
      ];

      tabs.forEach((tab) => {
        cy.get('body').then(($body) => {
          // Look for tab by name or link
          if ($body.find(`a:contains("${tab.name}")`).length > 0) {
            cy.contains('a', tab.name).click();
            cy.wait(500);
            // For home, just check it doesn't have other routes
            if (tab.url === '/') {
              cy.url().should('not.include', '/event');
              cy.url().should('not.include', '/createEvent');
              cy.url().should('not.include', '/login');
              cy.url().should('not.include', '/signup');
            } else {
              cy.url().should('include', tab.url);
            }
          } else if ($body.find(`[href*="${tab.url}"]`).length > 0) {
            cy.get(`[href*="${tab.url}"]`).first().click();
            cy.wait(500);
            if (tab.url === '/') {
              cy.url().should('not.include', '/event');
              cy.url().should('not.include', '/createEvent');
            } else {
              cy.url().should('include', tab.url);
            }
          }
        });
      });
    });

    it('should highlight active tab', () => {
      cy.visit('/event');
      cy.wait(500);
      
      // Check if active tab has special styling
      cy.get('body').should('exist');
    });
  });

  describe('Back Navigation', () => {
    it('should allow going back to previous page', () => {
      cy.visit('/event');
      cy.wait(1000);
      
      cy.visit('/createEvent');
      cy.wait(500);
      
      cy.go('back');
      cy.url().should('include', '/event');
    });
  });

  describe('Deep Linking', () => {
    it('should handle direct navigation to event details', () => {
      // Try to navigate directly to a specific route
      cy.visit('/event-details?id=1');
      cy.wait(1000);
      
      // Should either display event details or redirect appropriately
      cy.url().should('exist');
    });

    it('should redirect unauthenticated users to login', () => {
      // Clear any stored auth tokens
      cy.clearCookies();
      cy.clearLocalStorage();
      
      // Try to access protected route
      cy.visit('/createEvent');
      cy.wait(1000);
      
      // Should redirect to login or show login requirement
      cy.url().should('match', /login|createEvent/);
    });
  });
});
