Feature: User interacts with Search page

  Scenario: Default view of search page without any selections
    Given you are on the default search page
    Then there should be no search domain preselected

  Scenario: Selecting manually a search domain. User lands on the page without search domain preselected and selects Person domain
    Given you are on the default search page
    When you select the search domain Person
    Then there should be Person domain forms available to search with

  Scenario: Search domain is pre-selected. User lands on the search page with search domain Child Programme pre-selected
    Given you are in the search page with the Child Programme being pre-selected from the url
    Then there should be search domain Child Programme being pre-selected
    And there should be Child Programme domain forms visible to search with

  Scenario: Searching using unique identifier returns no results
    Given you are on the default search page
    And you select the search domain Malaria Case diagnosis
    When you fill in the unique identifier field with values that will not return a tracked entity instance
    And you click find
    Then there should be a modal popping up
    And you can close the modal

  Scenario: Searching using unique identifier returns results
    Given you are on the default search page
    And you select the search domain Malaria Case diagnosis
    When you fill in the unique identifier field with values that will return a tracked entity instance
  #  todo this throws an error
  #  And you click find
  #  Then you are navigated to the Tracker Capture

  Scenario: Searching using attributes returns no results
    Given you are on the default search page
    And you select the search domain Malaria Case diagnosis
    And you expand the attributes search area
    When you fill in the first name with values that will return no results
    And you click search
    Then there should be a modal popping up
    And you can close the modal

  Scenario: Searching using attributes returns results
    Given you are on the default search page
    And you select the search domain Malaria Case diagnosis
    And you expand the attributes search area
    When you fill in the first name with values that will return results
    And you click search
    Then there should be a success message

  Scenario: Searching using attributes throws error
    Given you are on the default search page
    And you select the search domain Malaria Case diagnosis
    And you expand the attributes search area
    When you fill in the first name with values that will return an error
    And you click search
    Then there should be an generic error message

  Scenario: Searching using attributes is invalid
    Given you are on the default search page
    And you select the search domain Malaria Case diagnosis
    And you expand the attributes search area
    When you dont fill in any of the values
    And you click search
    Then there should be a validation error message

  Scenario: Clicking the back button takes you to main page
    Given you are on the search page with preselected program and org unit
    When when you click the back button
    Then you should be taken to the main page with program and org unit preselected



