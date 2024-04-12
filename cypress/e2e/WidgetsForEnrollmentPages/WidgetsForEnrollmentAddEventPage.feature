Feature: The user interacts with the widgets on the enrollment add event page

  # Scenarios linked to the enrollment add event
  Scenario: The profile widget can be closed on the enrollment dashboard
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    And you see the widget with data-test profile-widget
    When you click the widget toggle open close button with data-test profile-widget
    Then the widget profile should be closed

  Scenario: The profile widget can be closed and reopened on the enrollment dashboard
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    And you see the widget with data-test profile-widget
    When you click the widget toggle open close button with data-test profile-widget
    And you click the widget toggle open close button with data-test profile-widget
    Then the profile details should be displayed

  Scenario: User can close the Enrollment Widget
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    And the enrollment widget should be opened
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be closed

  Scenario: User can close and reopen the Enrollment Widget
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    And the enrollment widget should be opened
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be closed
    When you click the enrollment widget toggle open close button
    Then the enrollment widget should be opened

  Scenario: User can see the enrollment details
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    Then the enrollment widget should be opened
    And the user sees the enrollment status is Active
    And the user sees the enrollment date
    And the user sees the incident date
    And the user sees the enrollment organisation unit
    And the user sees the owner organisation unit
    And the user sees the last update date

  Scenario: You can delete a tracked entity from the profile widget
    Given you add a new tracked entity in the Malaria focus investigation program
    When the user clicks the "Back to all stages and events" button
    When the user clicks the "New Event" button 
    When you open the overflow menu and click the "Delete Focus area" button
    Then you see the delete tracked entity confirmation modal
    When you confirm by clicking the "Yes, delete Focus area" button
    Then you are redirected to the home page

  # TODO DHIS2-11482 - The test cases related with enrollment status edit are flaky. Move them to unit tests.
  # Scenario: User can modify the enrollment from Active to Complete
  #   Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Active
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to complete
  #   Then the user sees the enrollment status is Complete

  # Scenario: User can modify the enrollment from Complete to Active
  #   Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Complete
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to incomplete
  #   Then the user sees the enrollment status is Active

  # Scenario: User can modify the enrollment from Active to Cancelled
  #   Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Active
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to cancel
  #   Then the user sees the enrollment status is Cancelled

  # Scenario: User can modify the enrollment from Cancelled to Active
  #   Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Cancelled
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to reactivate
  #   Then the user sees the enrollment status is Active

  # Scenario: User can mark the enrollment for followup
  #   Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user opens the enrollment actions menu
  #   When the user mark the enrollment for followup
  #   Then the user can see the enrollment is marked for follow up

  # Scenario: User can remove the enrollment for followup
  #   Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user opens the enrollment actions menu
  #   When the user remove the enrollment for followup
  #   Then the user can see the enrollment is not marked for follow up

  Scenario: User can open the delete modal
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    Then the enrollment widget should be opened
    When the user opens the enrollment actions menu
    And the user clicks on the delete action
    Then the user sees the delete enrollment modal

  Scenario: User switch tab in add event page
    Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
    Then the enrollment widget should be opened
    Then you should see tabs: Report,Schedule
    When you click switch tab to Schedule
    Then you should see Schedule tab
    And you should see suggested date: 08-01

  Scenario: You can assign a user when scheduling an event
  Given you land on the enrollment edit event page by having typed /#/enrollmentEventNew?enrollmentId=zRfAPUpjoG3&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&stageId=uvMKOn1oWvd&teiId=S3JjTA4QMNe
  When you click switch tab to Schedule
  Then you can assign a user when scheduling the event

  Scenario: User can complete the enrollment and the active events
    Given you land on the enrollment edit event page by having typed #/enrollmentEventNew?enrollmentId=qyx7tscVpVB&orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW&teiId=osF4RF4EiqP
    And the enrollment widget should be opened
    And the user sees the enrollment status and the Baby Postnatal event status is active
    And the user opens the enrollment actions menu
    When the user completes the enrollment and the active events
    Then the user sees the enrollment status and the Baby Postnatal event status is completed

  Scenario: User can see the enrollment minimap
    Given you land on the enrollment dashboard page by having typed #/enrollmentEventNew?enrollmentId=LltDWGFdwTX&orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW&teiId=lmcLfONF8rY&stageId=A03MvHHogjR
    Then you see the enrollment minimap
