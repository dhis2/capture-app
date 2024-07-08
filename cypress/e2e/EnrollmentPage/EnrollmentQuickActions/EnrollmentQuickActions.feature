Feature: User interacts with the quick actions-menu
  Scenario: The buttons should be disabled when stage is not available
    Given you are on an enrollment page with no stage available
    Then the buttons should be disabled

  Scenario: User can click the new event-button
    Given you are on an enrollment page with stage available
    When you click the report event-button
    Then you should be navigated to the report tab

  Scenario: User can click the schedule event-button
    Given you are on an enrollment page with stage available
    When you click the schedule event-button
    Then you should be navigated to the schedule tab

