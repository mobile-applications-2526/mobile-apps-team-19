# Event Joining and E2E Testing Summary

## Overview
This document explains how event joining functionality works with user and event IDs, as well as the end-to-end (e2e) test structure in the mobile application project.

---

## Event Joining Functionality

### How Event Joining Works

#### 1. **Frontend Flow**
When a user wants to join an event, the following process occurs:

**Location**: [Frontend/app/(tabs)/event.tsx](Frontend/app/(tabs)/event.tsx)

```typescript
const handleJoinEvent = async (event: Event) => {
  // 1. Verify user is logged in
  if (!currentUsername) {
    Alert.alert("Error", "You must be logged in to join an event");
    return;
  }

  // 2. Check if user is already a member
  if (event.usernames && event.usernames.includes(currentUsername)) {
    Alert.alert("Info", "You are already a member of this event");
    return;
  }

  // 3. Call API to join event
  const response = await joinEvent(event.title, currentUsername);
  
  // 4. Handle response and refresh events list
  if (response.ok) {
    Alert.alert("Success", "You have joined the event!");
    await loadUserAndFetchEvents();
  }
}
```

#### 2. **API Service Layer**
**Location**: [Frontend/service/eventService.ts](Frontend/service/eventService.ts)

```typescript
export const joinEvent = async (eventName: string, username: string) => {
  const headers = await getAuthHeaders();
  headers.set("Content-Type", "text/plain");
  
  return fetch(`${API_URL}/events/${encodeURIComponent(eventName)}/join`, {
    method: "POST",
    headers,
    body: username,  // Sends username as plain text in body
  });
};
```

#### 3. **Key Points**
- **Event Identification**: Events are identified by their **name** (not numeric ID) when joining
- **User Identification**: Uses the logged-in user's **username** 
- **Authentication**: Requires JWT token in Authorization header
- **API Endpoint**: `POST /events/{eventName}/join`
- **Request Body**: Plain text containing the username

#### 4. **User Interface**
Users can join events from the events page:
- Search for events using the search bar
- When searching, the app displays "all events" mode
- A "Join Event" button appears for events the user is not yet a member of
- After joining, the event appears in the user's event list

---

## Event Data Structure

### Event Model
```typescript
type Event = {
  id: string;                    // String representation for UI
  eventId?: number;              // Numeric ID from backend
  eventName: string;             // Event name (used for API calls)
  title: string;                 // Display title
  date: string;                  // Event date (YYYY-MM-DD format)
  location?: string;             // Event location
  photoCount: number;            // Number of pictures
  usernames: string[];           // Array of member usernames
}
```

### Backend Response
The backend returns events with the following structure:
```json
{
  "id": 1,
  "name": "My Event",
  "date": "2026-02-15",
  "hostName": "Test Host",
  "startTime": "10:00",
  "endTime": "12:00",
  "location": "Test Location",
  "usernames": ["johndoe", "janedoe"],
  "pictures": []
}
```

---

## E2E Test Structure

### Test Framework
- **Tool**: Cypress with Cucumber (BDD)
- **Preprocessor**: `@badeball/cypress-cucumber-preprocessor`
- **Location**: `Frontend/cypress/e2e/`

### Test Organization

#### 1. **Feature Files** (Gherkin Syntax)
Define test scenarios in human-readable format:

**Location**: `Frontend/cypress/e2e/features/`

##### Authentication Tests ([auth.feature](Frontend/cypress/e2e/features/auth.feature))
```gherkin
Feature: User Authentication
  As a user of the Recall app
  I want to be able to login
  So that I can securely access the application

  Scenario: Successful login with valid credentials
    When I enter username "johndoe"
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the home page
```

##### Event Management Tests ([events.feature](Frontend/cypress/e2e/features/events.feature))
```gherkin
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
```

##### Navigation Tests ([navigation.feature](Frontend/cypress/e2e/features/navigation.feature))
```gherkin
Feature: Application Navigation
  As a user of the Recall app
  I want to navigate between different sections

  Background:
    Given I am logged in as user "johndoe" with password "password123"

  Scenario: Navigate through main tabs
    When I visit the home page
    Then I should be on the home page
    When I click on the "Events" tab
    Then I should be on the events page
```

##### API Tests ([api.feature](Frontend/cypress/e2e/features/api.feature))
```gherkin
Feature: Backend API Integration
  As a developer
  I want to verify the backend API endpoints

  Background:
    Given the API base URL is "http://localhost:8080"

  Scenario: User login via API
    When I send a POST request to "/auth/login" with credentials:
      | username | johndoe     |
      | password | password123 |
    Then the response status should be 200
    And the response should contain a token
```

#### 2. **Step Definitions** (Implementation)
Implement the test steps in TypeScript:

**Location**: `Frontend/cypress/e2e/step_definitions/`

##### Events Step Definitions ([events.ts](Frontend/cypress/e2e/step_definitions/events.ts))
Key steps include:
- `Given I am logged in with username {string} and password {string}`
- `When I am on the create event page`
- `When I fill in the event form with:` (data table)
- `When I submit the event form`
- `When I click on the first event`
- `Then the event should be created successfully`
- `Then I should see {string} in the events list`

##### Navigation Step Definitions ([navigation.ts](Frontend/cypress/e2e/step_definitions/navigation.ts))
Key steps include:
- `Given I am logged in as user {string} with password {string}`
- `When I visit the home page`
- `When I click on the {string} tab`
- `When I click on the first event card`
- `Then I should be on the events page`

##### API Step Definitions ([api.ts](Frontend/cypress/e2e/step_definitions/api.ts))
Key steps include:
- `Given I have a valid authentication token for user {string}`
- `When I send a POST request to {string} with credentials:`
- `When I send a GET request to {string}`
- `Then the response status should be {int}`
- `Then the response should contain a token`

#### 3. **Custom Commands**
**Location**: `Frontend/cypress/support/commands.ts`

Custom Cypress commands for common operations:
```typescript
// Example: Login via API
cy.loginViaAPI(username, password);
```

---

## Authentication Flow

### 1. **JWT Token Management**
**Location**: [Frontend/utils/tokenManager.ts](Frontend/utils/tokenManager.ts)

- Tokens are stored and retrieved for authenticated requests
- Each API call includes the token in the Authorization header

### 2. **Auth Context**
**Location**: [Frontend/context/AuthContext.tsx](Frontend/context/AuthContext.tsx)

- Manages global authentication state
- Provides `isLoggedIn` status to components
- Used to protect routes and show/hide UI elements

---

## Testing Event Joining Flow

### Manual Test Scenario
1. **Login**: User logs in with credentials
2. **Navigate to Events**: Go to the events page
3. **Search for Event**: Use search bar to find an event
4. **Join Event**: Click "Join Event" button on a non-member event
5. **Verify Membership**: Event appears in "My Events" list
6. **Refresh**: Event still shows in user's list after page reload

### Expected E2E Test (not yet implemented)
```gherkin
Scenario: Join an existing event
  Given I am logged in with username "johndoe" and password "password123"
  And I am on the events page
  When I search for "Team Meeting"
  And I click the join button for "Team Meeting"
  Then I should see "Success" message
  And "Team Meeting" should appear in my events list
  And I should be a member of "Team Meeting"
```

---

## API Endpoints Summary

### Event-Related Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/events` | Get all events | Yes |
| POST | `/events` | Create new event | Yes |
| GET | `/events/{name}` | Get event by name | Yes |
| DELETE | `/events/{name}` | Delete event | Yes |
| POST | `/events/{name}/join` | Join event (body: username as plain text) | Yes |
| POST | `/events/{name}/add-picture` | Add picture to event | Yes |

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login user |
| POST | `/users/signup` | Register new user |

---

## Key Components

### Frontend Components
1. **Event Screen** ([Frontend/app/(tabs)/event.tsx](Frontend/app/(tabs)/event.tsx))
   - Lists user's events
   - Search functionality for all events
   - Join event functionality
   - Delete event functionality

2. **Event Details** ([Frontend/app/event-details.tsx](Frontend/app/event-details.tsx))
   - Shows detailed event information
   - Displays event pictures
   - Shows event members

3. **Create Event Form** ([Frontend/components/create-event-form.tsx](Frontend/components/create-event-form.tsx))
   - Form for creating new events

### Services
1. **Event Service** ([Frontend/service/eventService.ts](Frontend/service/eventService.ts))
   - `getEvents()`: Fetch all events
   - `createEvent()`: Create new event
   - `joinEvent()`: Join an event
   - `deleteEvent()`: Delete an event
   - `getEventByName()`: Get specific event

2. **User Service** ([Frontend/service/userService.ts](Frontend/service/userService.ts))
   - `loginUser()`: Authenticate user
   - `signupUser()`: Register new user

---

## Testing Best Practices

### 1. **BDD Approach**
- Write scenarios in plain English (Gherkin)
- Focus on user behavior, not implementation
- Use "Given-When-Then" structure

### 2. **Test Data**
- Use consistent test users (e.g., "johndoe" / "password123")
- Create test events with predictable names
- Clean up test data after scenarios

### 3. **Assertions**
- Check UI elements are visible/hidden
- Verify navigation works correctly
- Validate API responses
- Ensure data persists after actions

### 4. **API vs UI Tests**
- **API Tests**: Fast, test backend directly
- **UI Tests**: Slower, test full user journey
- Use both for comprehensive coverage

---

## Configuration Files

### Test Configuration
- **cypress.config.ts**: Main Cypress configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and test scripts

### Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API URL (e.g., "http://localhost:8080")

---

## Running E2E Tests

### Commands
```bash
# Run all tests in headless mode
npm run cypress:run

# Open Cypress UI for interactive testing
npm run cypress:open

# Run specific feature
npx cypress run --spec "cypress/e2e/features/events.feature"
```

---

## Summary

### Event Joining
- **Identification**: Uses event name and username
- **API**: POST request to `/events/{eventName}/join`
- **Body**: Plain text username
- **Auth**: Requires JWT token
- **UI**: Search → Find event → Click "Join Event"

### E2E Testing
- **Framework**: Cypress + Cucumber (BDD)
- **Structure**: Feature files (Gherkin) + Step definitions (TypeScript)
- **Coverage**: Authentication, Navigation, Event Management, API Integration
- **Approach**: User-focused scenarios with clear Given-When-Then steps
- **Location**: All tests in `Frontend/cypress/e2e/`

This architecture ensures that event joining is properly tested from both the API level (direct HTTP requests) and UI level (user interactions).
