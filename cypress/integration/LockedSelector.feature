Feature: using the LockedSelector to navigate
#
#  Scenario: Notifying that you need to select org unit and program to get started
#    Given you are in the main page with no selections made
#    When you click the "New" button to add a new event
#    Then text should inform you to select both organisation unit and program
#
#  Scenario: Notifying that you need to select a program to get started
#    Given you are in the main page with organisation unit pre-selected
#    When you click the "New" button to add a new event
#    Then text should inform you to select program
#
#  Scenario: Notifying that you need to select a org unit to get started
#    Given you are in the main page with program unit pre-selected
#    When you click the "New" button to add a new event
#    Then text should inform you to select program
#
#  Scenario: Clicking start again takes you to the main page
#    Given you are in the main page with no selections made
#    And you select both org unit and program
#    When you click the "Start again" button
#    Then you should be taken to the main page
#
#  Scenario: Selecting org unit and program and seeing table
#    Given you are in the main page with no selections made
#    When you select both org unit and program
#    Then you should see the table

  Scenario: Notifying that you need to select a org unit to get started
    Given you are in the main page with no selections made
    When you select both org unit and program
    And you click the "New" button to add a new event
