Feature: User creates a new entries from the registration page

  Scenario: Viewing the registration page without any selections
    Given you are on the default registration page
    Then there should be informative message explaining you need to select an organisation unit

  Scenario: Viewing the registration page with incomplete partner selection
    Given you are in the main page with no selections made
    And you select org unit
    And you select the Contraceptives Voucher Program
    Then you see a dropdown button
    When you click the the first option option
    Then you are navigated to the Contraceptives Voucher Program registration page with program selected
    And there should be informative message explaining you need to complete your selections

  Scenario: Viewing the registration page with organisation unit selected
    Given you are on the default registration page
    And you select org unit
    Then you see the dropdown menu for selecting tracked entity type

  Scenario: Viewing the registration page with organisation unit and tracked entity type person selected
    Given you are on the default registration page
    And you select org unit
    And you select tracked entity type person
    Then you see the registration form for the Person

  Scenario: Viewing the registration page with organisation unit and tracker program Child Programme selected
    Given you are on the default registration page
    And you select org unit
    And you select the Child Programme
    Then you see a registration form for the Child Programme

  Scenario: Viewing the registration page with organisation unit and event program Malaria case registration selected
    Given you are on the default registration page
    And you select org unit
    And you select the Malaria case registration program
    Then you see the registration form for the Malaria case registration

  Scenario: Navigating to registration page without program selected
    Given you are in the main page with no selections made
    And you select org unit
    And you select the Child Programme
    Then you see a dropdown button
    When you click the "New..." option
    Then you are navigated to the registration page without program selected
    And you see the dropdown menu for selecting tracked entity type
    And you have no program selection

  Scenario: Navigating to registration page with program selected
    Given you are in the main page with no selections made
    And you select org unit
    And you select the Child Programme
    Then you see a dropdown button
    When you click the the first option option
    Then you are navigated to the Child Programme registration page with program selected
    And you see a registration form for the Child Programme
    And you have Child Programme selected

  Scenario: Navigating to registration page after selecting partner
    Given you are in the main page with no selections made
    And you select org unit
    And you select the Contraceptives Voucher Program
    Then you see a dropdown button
    When you click the the first option option
    Then you are navigated to the Contraceptives Voucher Program registration page with program selected
    And there should be informative message explaining you need to complete your selections
    When you select the first partner
    Then you see the registration form for the scpecific partner
