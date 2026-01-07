Feature: Application Navigation
  As a user of the Recall app
  I want to navigate between different sections
  So that I can access all features of the application

  Background:
    Given I am logged in as user "johndoe" with password "password123"

  Scenario: Navigate through main tabs
    When I visit the home page
    Then I should be on the home page
    When I click on the "Events" tab
    Then I should be on the events page
