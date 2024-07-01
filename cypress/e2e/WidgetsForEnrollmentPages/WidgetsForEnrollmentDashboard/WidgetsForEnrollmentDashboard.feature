Feature: The user interacts with the widgets on the enrollment dashboard

  Scenario: User can open the transfer modal
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the enrollment widget should be opened
    When the user opens the enrollment actions menu
    And the user clicks on the transfer action
    Then the user sees the transfer modal

  Scenario: User can select an organisation unit in the transfer modal
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the enrollment widget should be opened
    When the user opens the enrollment actions menu
    And the user clicks on the transfer action
    And the user sees the transfer modal
    And the user sees the organisation unit tree
    When the user clicks on the organisation unit with text: Sierra Leone
    Then the user sees the organisation unit with text: Sierra Leone is selected

  @with-transfer-ownership-data-cleanup
  Scenario: User can transfer the enrollment to another organisation unit
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=wBU0RAsYjKE
    Then the enrollment widget should be opened
    And the enrollment owner organisation unit is Ngelehun CHC
    When the user opens the enrollment actions menu
    And the user clicks on the transfer action
    And the user sees the transfer modal
    And the user sees the organisation unit tree
    When the user clicks on the organisation unit with text: Sierra Leone
    Then the user successfully transfers the enrollment

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

  Scenario: You can delete a tracked entity from the profile widget
    Given you add a new tracked entity in the Malaria focus investigation program
    When the user clicks the "Back to all stages and events" button 
    When you open the overflow menu and click the "Delete Focus area" button
    Then you see the delete tracked entity confirmation modal
    When you confirm by clicking the "Yes, delete Focus area" button
    Then you are redirected to the home page

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

  Scenario: User can complete the enrollment and the active events
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=qyx7tscVpVB
    And the enrollment widget should be opened
    And the user sees the enrollment status and the Baby Postnatal event status is active
    And the user opens the enrollment actions menu
    When the user completes the enrollment and the active events
    Then the user sees the enrollment status and the Baby Postnatal event status is completed

  Scenario: User can see the enrollment minimap
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=LltDWGFdwTX&orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW&teiId=lmcLfONF8rY
    Then you see the enrollment minimap

  Scenario: User can see in the profile widget the tracked entity type polygon geometry
    Given you land on the enrollment dashboard page by having typed #/enrollment?enrollmentId=ZjixUoY4jE8&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&teiId=Imv2o18b9wX
    And you see the widget with data-test profile-widget
    When the user clicks the element containing the text: Edit
    Then the user sees the tracked entity type polygon geometry
