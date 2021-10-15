Feature: User is able to select program stage when navigating to EnrollmentEventNew without stageId

  Scenario: User can select stage when not present
    Given you land on the EnrollmentEventNew-page without a stageId
    When the user clicks the Baby Postnatal-button
    Then the URL should contain stageId

  Scenario: The stage-button should be disabled when non-repeatable & event > 0
    Given you land on the EnrollmentEventNew-page without a stageId
    Then the stage-button should be disabled
