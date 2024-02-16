Feature: The user interacts with the widgets on the enrollment dashboard

  # Scenarios linked to the enrollment dashboard
  Scenario: The profile widget can be closed on the enrollment dashboard
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    And you see the widget with data-test profile-widget
    When you click the widget toggle open close button with data-test profile-widget
    Then the widget profile should be closed

  Scenario: The profile widget can be closed and reopened on the enrollment dashboard
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    And you see the widget with data-test profile-widget
    When you click the widget toggle open close button with data-test profile-widget
    And you click the widget toggle open close button with data-test profile-widget
    Then the profile details should be displayed

  Scenario: The profile edit modal widget can be closed and reopened on the enrollment dashboard
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    And you see the widget with data-test profile-widget
    When the user clicks the element containing the text: Edit
    Then the user sees the edit profile modal
    When the user clicks the element containing the text: Cancel without saving
    Then the profile details should be displayed

  Scenario: The TEI rules are triggered correctly in the profile edit modal widget
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=ek4WWAgXX5i
    And you see the widget with data-test profile-widget
    When the user clicks the element containing the text: Edit
    Then the user sees the edit profile modal
    And the user don't see the following text: The womans age is outside the normal range. With the birthdate entered, the age would be: 0
    And the user sets the birthday date to the current date
    Then the user see the following text: The womans age is outside the normal range. With the birthdate entered, the age would be: 0

  Scenario: The user updates the TEI attributes. The changes are reflected in the whole page.
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=TjP3J9cf0z1&orgUnitId=CgunjDKbM45&programId=WSGAb5XwJ3Y&teiId=jzIwoNXIZsK
    When the user clicks the element containing the text: Edit
    And the user sees the edit profile modal
    And the user sets the first name to TestName
    And the user clicks the save button
    Then the profile widget attributes list contains the text TestName
    And the scope selector list contains the text TestName
    When the user clicks the element containing the text: Edit
    And the user sees the edit profile modal
    And the user sets the first name to Maria
    And the user clicks the save button
    Then the profile widget attributes list contains the text Maria
    And the scope selector list contains the text Maria

  Scenario: User can close the Enrollment Widget
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    And the enrollment widget should be opened
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be closed

  Scenario: User can close and reopen the Enrollment Widget
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    And the enrollment widget should be opened
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be closed
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be opened

  Scenario: User can see the enrollment details
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the enrollment widget should be opened
    And the user sees the enrollment status is Active
    And the user sees the enrollment date
    And the user sees the incident date
    And the user sees the enrollment organisation unit
    And the user sees the owner organisation unit
    And the user sees the last update date

  # TODO DHIS2-11482 - The test cases related with enrollment status edit are flaky. Move them to unit tests.
  # Scenario: User can modify the enrollment from Active to Complete
  #   Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Active
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to complete
  #   Then the user sees the enrollment status is Complete

  # Scenario: User can modify the enrollment from Complete to Active
  #   Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Complete
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to incomplete
  #   Then the user sees the enrollment status is Active

  # Scenario: User can modify the enrollment from Active to Cancelled
  #   Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Active
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to cancel
  #   Then the user sees the enrollment status is Cancelled

  # Scenario: User can modify the enrollment from Cancelled to Active
  #   Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Cancelled
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to reactivate
  #   Then the user sees the enrollment status is Active

  # Scenario: User can mark the enrollment for followup
  #   Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
  #   And the enrollment widget should be opened
  #   And the user opens the enrollment actions menu
  #   When the user mark the enrollment for followup
  #   Then the user can see the enrollment is marked for follow up

  # Scenario: User can remove the enrollment for followup
  #   Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
  #   And the enrollment widget should be opened
  #   And the user opens the enrollment actions menu
  #   When the user remove the enrollment for followup
  #   Then the user can see the enrollment is not marked for follow up

  Scenario: User can open the delete modal
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the enrollment widget should be opened
    When the user opens the enrollment actions menu
    And the user clicks on the delete action
    Then the user sees the delete enrollment modal

  Scenario: User can add note on enrollment dashboard page
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the stages and events should be loaded
    When you fill in the comment: new test enrollment comment
    Then list should contain the new comment: new test enrollment comment

  Scenario: The program rules are triggered and the effects are displayed in the sidebar widgets
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the user can see the program rules effect in the indicator widget
