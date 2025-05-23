Feature: The user interacts with the widgets on the enrollment edit event

  # Scenarios linked to the enrollment edit event
  Scenario: The profile widget can be closed on the enrollment edit event
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    And you see the widget with data-test profile-widget
    When you click the widget toggle open close button with data-test profile-widget
    Then the widget profile should be closed

  Scenario: The profile widget can be closed and reopened on the enrollment edit event
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    And you see the widget with data-test profile-widget
    When you click the widget toggle open close button with data-test profile-widget
    And you click the widget toggle open close button with data-test profile-widget
    Then the profile details should be displayed

  Scenario: User can close the Enrollment Widget
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    And the enrollment widget should be opened
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be closed

  Scenario: User can close and reopen the Enrollment Widget
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    And the enrollment widget should be opened
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be closed
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be opened

  Scenario: User can see the enrollment details
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be opened
    And the user sees the enrollment status is Active
    And the user sees the enrollment date
    And the user sees the incident date
    And the user sees the enrollment organisation unit
    And the user sees the owner organisation unit
    And the user sees the last update date

  Scenario: User can open the delete modal
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be opened
    When the user opens the enrollment actions menu
    And the user clicks on the delete action
    Then the user sees the delete enrollment modal

  Scenario: User can add note on edit event page view mode
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be loaded
    When you fill in the note: view mode note
    Then list should contain the new note: view mode note

  Scenario: User can see note on edit event page edit mode
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be loaded
    When you click edit mode
    And you fill in the note: edit mode note
    Then list should contain the new note: edit mode note

  Scenario: You can assign a user to a event
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=veuwiLC2x0e&orgUnitId=g8upMTyEZGZ
    When you assign the user Geetha in the view mode
    Then the event has the user Geetha Alwan assigned
    When you assign the user Tracker demo User in the edit mode
    Then the event has the user Tracker demo User assigned
    When you remove the assigned user
    Then the event has no assignd user

  Scenario: User can complete the enrollment and the active events
    Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=PyXThVzWJzL&orgUnitId=RzgSFJ9E46G
    And the enrollment widget should be opened
    And the user sees the enrollment status and the Baby Postnatal event status is active
    And the user opens the enrollment actions menu
    When the user completes the enrollment and the active events
    Then the user sees the enrollment status and the Baby Postnatal event status is completed

  Scenario: User can see the enrollment minimap
    Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=W1uHdJEjZUI&orgUnitId=DiszpKrYNg8
    Then you see the enrollment minimap

