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

  Scenario: You can delete a tracked entity from the profile widget
    Given you add a new tracked entity in the Malaria focus investigation program
    When you open the overflow menu and click the "Delete Focus area" button
    Then you see the delete tracked entity confirmation modal
    When you confirm by clicking the "Yes, delete Focus area" button
    Then you are redirected to the home page

  # TODO DHIS2-11482 - The test cases related with enrollment status edit are flaky. Move them to unit tests.
  # Scenario: User can modify the enrollment from Active to Complete
  #   Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Active
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to complete
  #   Then the user sees the enrollment status is Complete

  # Scenario: User can modify the enrollment from Complete to Active
  #   Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Complete
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to incomplete
  #   Then the user sees the enrollment status is Active

  # Scenario: User can modify the enrollment from Active to Cancelled
  #   Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Active
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to cancel
  #   Then the user sees the enrollment status is Cancelled

  # Scenario: User can modify the enrollment from Cancelled to Active
  #   Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user sees the enrollment status is Cancelled
  #   And the user opens the enrollment actions menu
  #   When the user changes the enrollment status to reactivate
  #   Then the user sees the enrollment status is Active

  # Scenario: User can mark the enrollment for followup
  #   Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user opens the enrollment actions menu
  #   When the user mark the enrollment for followup
  #   Then the user can see the enrollment is marked for follow up

  # Scenario: User can remove the enrollment for followup
  #   Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR
  #   And the enrollment widget should be opened
  #   And the user opens the enrollment actions menu
  #   When the user remove the enrollment for followup
  #   Then the user can see the enrollment is not marked for follow up

  Scenario: User can open the delete modal
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be opened
    When the user opens the enrollment actions menu
    And the user clicks on the delete action
    Then the user sees the delete enrollment modal

  Scenario: User can add note on edit event page view mode
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be loaded
    When you fill in the comment: new test comment
    Then list should contain the new comment: new test comment

  Scenario: User can see note on edit event page edit mode
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=XGLkLlOXgmE&orgUnitId=DiszpKrYNg8
    Then the enrollment widget should be loaded
    When you click edit mode
    Then list should contain the new comment: new test comment

  Scenario: You can assign a user to a event
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=veuwiLC2x0e&orgUnitId=g8upMTyEZGZ
    When you assign the user Geetha in the view mode
    Then the event has the user Geetha Alwan assigned
    When you assign the user Tracker demo User in the edit mode
    Then the event has the user Tracker demo User assigned
    When you remove the assigned user
    Then the event has no assignd user
  
  @v>=41
  Scenario: The user can view an event changelog on the enrollment edit event
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    When you select view changelog in the event overflow button
    Then the changelog modal should be visible
    And the changelog modal should contain data
    # One row is filtered out as the metadata is no longer there
    And the number of changelog table rows should be 9
  
  @v>=41
  Scenario: The user can change changelog page size
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    When you select view changelog in the event overflow button
    And you change the page size to 20
    # One row is filtered out as the metadata is no longer there
    Then the number of changelog table rows should be 19
    And you change the page size to 100
    Then the number of changelog table rows should be 37
    Then the table footer should display page 1
  
  @v>=41
  Scenario: The user can move to the next page in the changelog
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    When you select view changelog in the event overflow button
    And you move to the next page
    Then the table footer should display page 2

  Scenario: User can complete the enrollment and the active events
    Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=OWpIzQ4xabC&orgUnitId=DiszpKrYNg8
    And the enrollment widget should be opened
    And the user sees the enrollment status and the Baby Postnatal event status is active
    And the user opens the enrollment actions menu
    When the user completes the enrollment and the active events
    Then the user sees the enrollment status and the Baby Postnatal event status is completed

  Scenario: User can see the enrollment minimap
    Given you land on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=W1uHdJEjZUI&orgUnitId=DiszpKrYNg8
    Then you see the enrollment minimap

