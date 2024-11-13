Feature: User facing tests for bulk actions on event working lists

  Scenario: the user should be able to select rows
    Given you open the main page with Ngelehun and malaria case context
    When you select the first 5 rows
    Then the bulk action bar should say 5 selected
    And the first 5 rows should be selected

  Scenario: the user should be able to deselect rows
    Given you open the main page with Ngelehun and malaria case context
    When you select the first 5 rows
    And you deselect the first 3 rows
    Then the bulk action bar should say 2 selected

  Scenario: the user should be able to select all rows
    Given you open the main page with Ngelehun and malaria case context
    When you select all rows
    Then the bulk action bar should say 15 selected
    And all rows should be selected

  Scenario: the user should be able to deselect all rows
    Given you open the main page with Ngelehun and malaria case context
    When you select all rows
    And all rows should be selected
    And you select all rows
    Then the bulk action bar should not be present
    And no rows should be selected

  Scenario: the filters should be disabled when rows are selected
    Given you open the main page with Ngelehun and malaria case context
    When you select the first 5 rows
    Then the filters should be disabled

  @v<42
  Scenario: the user should be able to bulk complete events
    Given you open the main page with Ngelehun and malaria case context
    And you select the first 3 rows
    And you click the bulk complete button
    And the bulk complete modal should open
    When you click the confirm complete events button
    Then the bulk complete modal should close

  Scenario: the user should be able to bulk delete events
    Given you open the main page with Ngelehun and malaria case context
    And you select the first 3 rows
    And you click the bulk Delete button
    And the bulk delete modal should open
    When you click the confirm delete events button
    Then the bulk delete modal should close
