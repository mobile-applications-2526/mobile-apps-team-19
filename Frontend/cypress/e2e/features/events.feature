Feature: Event Management
  As a logged-in user
  I want to manage events
  So that I can create events

  Background:
    Given I am logged in with username "johndoe" and password "password123"

  Scenario: Create a new event
    Given I am on the create event page
    When I fill in the event form with:
      | name      | My Test Event      |
      | date      | 2026-02-15         |
      | hostName  | Test Host          |
      | location  | Test Location      |
      | startTime | 10:00              |
      | endTime   | 12:00              |
    And I submit the event form
    Then the event should be created successfully
