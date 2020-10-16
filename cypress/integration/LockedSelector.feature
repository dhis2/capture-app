Feature: Use the LockedSelector to navigate
  # Main page

  Scenario: Notifying that you need to select org unit and program to get started
    Given you are in the main page with no selections made
    When you click the "New" button to add a new event
    Then you should see informative text saying you should do finish your selections

  Scenario: Notifying that you need to select a program to get started
    Given you are in the main page with organisation unit preselected
    When you click the "New" button to add a new event
    Then you should see informative text saying you should do finish your selections

  Scenario: Notifying that you need to select an org unit to get started
    Given you are in the main page with program unit preselected
    When you click the "New" button to add a new event
    Then you should see informative text saying you should do finish your selections

  Scenario: Clicking start again takes you to the main page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you click the "Start again" button
    Then you should be taken to the main page

  Scenario: Selecting org unit and program and seeing table
    Given you are in the main page with no selections made
    When you select both org unit and program Malaria case registration
    Then you should see the table

  Scenario: Landing on main page with with invalid program id
    Given you land on a main page with an invalid program id
    Then you should see error message

  Scenario: Landing on main page with invalid org unit id
    Given you land on a main page with an invalid org unit id
    Then you should see error message

  Scenario: Selecting program on main event page with preselected org unit
    Given you land on a main event page with preselected org unit
    When you select program
    Then main page page url is valid
    And you can see the new event page

  Scenario: Selecting org unit on main event page with preselected program
    Given you land on a main event page with preselected program
    When you select org unit
    Then main page page url is valid
    And you can see the new event page

  # New Event page

  Scenario: Landing on the new event page
    Given you are in the main page with no selections made
    When you select both org unit and program Malaria case registration
    And you click the "New" button to add a new event
    Then you can see the new event page

  Scenario: Clicking cancel from the new event page
    Given you are in the new event page with no selections made
    When you click the cancel button
    Then you should be taken to the main page

  Scenario: Selecting program on new event page with preselected org unit
    Given you land on a new event page with preselected org unit
    When you select program
    Then new event page url is valid
    And you can see the new event page

  Scenario: Selecting org unit on new event page with preselected program
    Given you land on a new event page with preselected program
    When you select org unit
    Then new event page url is valid
    And you can see the new event page

  Scenario: Landing on new event page with invalid program id
    Given you land on a new event page with an invalid program id
    Then you should see error message

  Scenario: Landing on new event page with invalid org unit id
    Given you land on a new event page with an invalid org unit id
    Then you should see error message

  # View Event page

  Scenario: Landing on the view event page
    Given you land on a view event page from the url
    Then you can see the view event page

  Scenario: Selecting the first entry of the events
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you select the first entity from the table
    Then you can see the view event page

  Scenario: Clicking the start again button after you have been navigated to a vew event page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you select the first entity from the table
    And you click the "Start again" button
    Then you should be taken to the main page

  Scenario: Removing the program selection after you have been navigated to a vew event page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    And you select the first entity from the table
    When you remove the program selection
    Then you should be taken to the main page with only org unit selected

  Scenario: Removing the org unit selection after you have been navigated to a vew event page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    And you select the first entity from the table
    When you remove the org unit selection
    Then you should be taken to the main page with only program selected

  Scenario: Landing on view event page with invalid id
    Given you land on a view event page with an invalid id
    Then you should see error message

  Scenario: Clicking the find button when the preselected program is not an available search domain
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you click the find button
    Then you stay in the events page since you cant search for events

  Scenario: Clicking the find button when the preselected program can be a search domain
    Given you are in the main page with no selections made
    And you select both org unit and program Child Programme
    When you click the find button from the dropdown menu
    Then you are navigated to the search page with the same org unit and program Child Programme
    And there should be visible a title with Child Program
    And there should be Child Programme domain forms visible to search with
