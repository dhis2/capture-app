Feature: using the search page to search for tracked entities

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

Scenario: Searching for entity returns no results. User picks a search domain. User searches for entity using unique identifier
  Given you are on the default search page
  And you select the search domain Child Programme
  When you fill in the unique identifier field with values that will not return a tracked entity instance
  And you click find
  Then there should be a modal popping up
  And you can close the modal

Scenario: Searching for entity returns results. User picks a search domain. User searches for entity using unique identifier
  Given you are on the default search page
  And you select the search domain Child Programme
  When you fill in the unique identifier field with values that will return a tracked entity instance
#  todo this throws an error
#  And you click find
#  Then you are navigated to the Tracker Capture

Scenario: Searching for entity returns no results. User picks a search domain. User searches for entity using attributes
  Given you are on the default search page
  And you select the search domain Child Programme
  When you fill in the first name with values that will return no results
  And you click search
  Then there should be a modal popping up
  And you can close the modal

Scenario: Searching for entity returns results. User picks a search domain. User searches for entity using attributes
  Given you are on the default search page
  And you select the search domain Child Programme
  When you fill in the first name with values that will return results
  And you click search
  Then there should be a success message

Scenario: Searching for entity returns throws error. User picks a search domain. User searches for entity using attributes
  Given you are on the default search page
  And you select the search domain Child Programme
  When you fill in the first name with values that will return an error
  And you click search
  Then there should be an generic error message

Scenario: Searching for entity is invalid. User picks a search domain. User searches for entity using attributes
  Given you are on the default search page
  And you select the search domain Child Programme
  When you dont fill in any of the values
  And you click search
  Then there should be a validation error message



