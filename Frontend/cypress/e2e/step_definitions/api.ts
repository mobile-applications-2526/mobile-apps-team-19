import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const API_URL = 'http://localhost:8080';
let authToken: string;
let responseData: any;

// Background
Given('the API base URL is {string}', (baseUrl: string) => {
  // Just for documentation - API_URL is already set
  expect(API_URL).to.equal(baseUrl);
});

Given('I have a valid authentication token for user {string}', (username: string) => {
  cy.request({
    method: 'POST',
    url: `${API_URL}/auth/login`,
    body: {
      username: username,
      password: 'password123'
    }
  }).then((response) => {
    authToken = response.body.token;
    expect(authToken).to.exist;
  });
});

Given('an event exists with id {string}', (eventId: string) => {
  // Verify event exists
  cy.request({
    method: 'GET',
    url: `${API_URL}/events`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  }).then((response) => {
    expect(response.body).to.be.an('array');
  });
});

// When steps
When('I send a POST request to {string} with:', (endpoint: string, dataTable: any) => {
  const data = dataTable.rowsHash();
  cy.request({
    method: 'POST',
    url: `${API_URL}${endpoint}`,
    body: data,
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

When('I send a POST request to {string} with credentials:', (endpoint: string, dataTable: any) => {
  const data = dataTable.rowsHash();
  cy.request({
    method: 'POST',
    url: `${API_URL}${endpoint}`,
    body: data,
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
    if (response.body.token) {
      authToken = response.body.token;
    }
  });
});

When('I send a GET request to {string}', (endpoint: string) => {
  cy.request({
    method: 'GET',
    url: `${API_URL}${endpoint}`,
    headers: authToken ? {
      'Authorization': `Bearer ${authToken}`
    } : {},
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

When('I send a PUT request to {string} with:', (endpoint: string, dataTable: any) => {
  const data = dataTable.rowsHash();
  cy.request({
    method: 'PUT',
    url: `${API_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: data,
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

When('I send a DELETE request to {string}', (endpoint: string) => {
  cy.request({
    method: 'DELETE',
    url: `${API_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

When('I send a POST request to {string} with event id {string}', (endpoint: string, eventId: string) => {
  cy.request({
    method: 'POST',
    url: `${API_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: {
      eventId: eventId,
      url: 'https://example.com/test-image.jpg',
      hashtags: ['test']
    },
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

When('I send a GET request to {string} without authentication', (endpoint: string) => {
  cy.request({
    method: 'GET',
    url: `${API_URL}${endpoint}`,
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

When('I send a POST request to {string} with invalid data', (endpoint: string) => {
  cy.request({
    method: 'POST',
    url: `${API_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: {
      // Missing required fields
      name: ''
    },
    failOnStatusCode: false
  }).then((response) => {
    responseData = response;
  });
});

// Then steps
Then('the response status should be {int}', (statusCode: number) => {
  expect(responseData.status).to.equal(statusCode);
});

Then('the response status should be {int} or {int}', (status1: number, status2: number) => {
  expect([status1, status2]).to.include(responseData.status);
});

Then('the response should contain a token', () => {
  expect(responseData.body.token).to.exist;
});

Then('I should be able to use the token for authenticated requests', () => {
  expect(authToken).to.exist;
  expect(authToken).to.be.a('string');
});

Then('the response should contain an array of events', () => {
  expect(responseData.body).to.be.an('array');
});

Then('each event should have required fields', () => {
  if (responseData.body.length > 0) {
    const event = responseData.body[0];
    expect(event).to.have.property('id');
    expect(event).to.have.property('name');
  }
});

Then('the response should contain the created event', () => {
  expect(responseData.body).to.be.an('object');
  expect(responseData.body).to.have.property('name');
});

Then('the event should have an id', () => {
  expect(responseData.body).to.have.property('id');
});

Then('the response should contain the updated event', () => {
  expect(responseData.body).to.be.an('object');
});

Then('the response should contain an array of pictures', () => {
  expect(responseData.body).to.satisfy((body: any) => {
    return Array.isArray(body) || (body && Array.isArray(body.pictures));
  });
});
