Feature: User interacts with a single event page view/edit form

  Scenario: The single event is edited and the changes are reflected in the working list
    Given you open the main page with Ngelehun and antenatal care context
    And you open the first event in the list
    And you complete and save the event
    Then you are redirected to the main page and the event status Completed is displayed in the list
    And you open the first event in the list
    And you incomplete and save the event
    Then you are redirected to the main page and the event status Active is displayed in the list

  # Interacting with category combination programs
  @with-event-coc-clean-up
  Scenario: User views the event details page
    Given you land on the view event page with event id: rgWr86qs0sI
    Then the event details page displays the category combination

  @with-event-coc-clean-up
  Scenario: User edits the category combination
    Given you land on the view event page with event id: rgWr86qs0sI
    And you enable edit mode
    When you change the category combination and save
    And you land on the view event page with event id: rgWr86qs0sI
    Then the event details page displays the updated category combination

  Scenario: The user can add and then delete a relationship to a tracked entity
    Given you open an event in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you search for an existing unique id and link to the person
    And you click the delete relationship button
    Then the relationship is deleted

  Scenario: The user can see the enroll form for a tracked entity by adding a relationship
    Given you land on the view event page with event id: a2d8c7cdd2d
    And you navigate to register a person relationship
    And you select the TB Program
    Then the TB program enroll form is loaded

  Scenario: User can add note on edit event page view mode
    Given you land on the edit event page by having typed /#/viewEvent?orgUnitId=DiszpKrYNg8&viewEventId=a36385cbdb2
    When you fill in the note: view mode note
    Then list should contain the new note: view mode note

  Scenario: User can see note on edit event page edit mode
    Given you land on the edit event page by having typed /#/viewEvent?orgUnitId=DiszpKrYNg8&viewEventId=a36385cbdb2
    And you enable edit mode
    And you fill in the note: edit mode note
    Then list should contain the new note: edit mode note