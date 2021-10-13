Feature: User interacts with the quick actions-menu

  Scenario: User can click the new event-button
    Given you are on an enrollment page
    When you click the new event-button
    Then you should be navigated to the new tab

  Scenario: User can click the refer event-button
    Given you are on an enrollment page
    When you click the refer event-button
    Then you should be navigated to the refer tab

  Scenario: User can click the schedule event-button
    Given you are on an enrollment page
    When you click the schedule event-button
    Then you should be navigated to the schedule tab
