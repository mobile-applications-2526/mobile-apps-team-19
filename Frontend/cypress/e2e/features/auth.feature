Feature: User Authentication
  As a user of the Recall app
  I want to be able to login
  So that I can securely access the application

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter username "johndoe"
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the home page
    And I should not see the login page
