Feature: the user interacts with the "view all records regardless of OrgUnit"-page.

  Scenario: The working list are hidden by default.
    When the user opens the main page
    Then the working list should not be displayed

  Scenario: A message will be shown when OrgUnit is not selected
    Given the user opens the main page
    When the user selects the program Antenatal care visit
    Then the IncompleteSelections-box should be displayed

  Scenario: The working list will hydrate when event program is selected
    Given the user opens the main page
    And the user selects the program Malaria case registration
    When the user clicks the show accessible button
    Then the working list should be displayed

  Scenario: The working list will hydrate when tracker program is selected
    Given the user opens the main page
    And the user selects the program Child Programme
    When the user clicks the show accessible button
    Then the working list should be displayed

  Scenario: the working list will hydrate when updated by the URL
    When the user navigates to /#/?programId=VBqh0ynB2wv&all
    Then the working list should be displayed
