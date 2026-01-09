Feature: Backend API Integration
  As a developer
  I want to verify the backend API endpoints
  So that I ensure the frontend can communicate correctly with the backend

  Background:
    Given the API base URL is "http://localhost:8080"

  Scenario: User login via API
    When I send a POST request to "/auth/login" with credentials:
      | username | johndoe     |
      | password | password123 |
    Then the response status should be 200
    And the response should contain a token

