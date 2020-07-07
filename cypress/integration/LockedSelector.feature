Feature: using the LockedSelector to navigate

Scenario: There is text in the page which explains to the user that they need to select org unit and program to get started

  Given you are in the main page with no selections made
  When you click the "New" button to add a new event
  Then text should inform you to select both organisation unit and program

Scenario: There is text in the page which explains to the user that they need to select a program to get started

  Given you are in the main page with organisation unit selected
  When you click the "New" button to add a new event
  Then text should inform you to select program
