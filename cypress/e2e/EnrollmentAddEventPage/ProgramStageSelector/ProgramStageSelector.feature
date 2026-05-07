Feature: Program stage selector when navigating to EnrollmentEventNew without stageId

  Scenario: User can select stage when not present
    Given user lands on the EnrollmentEventNew-page without a stageId by typing #/enrollmentEventNew?enrollmentId=PAHlrkHc40G&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&teiId=H0YmvIuKqv0
    When the user clicks the Care at birth program stage button
    Then the URL should contain stageId PFDfvmGpsR3

  Scenario: Non-repeatable stages should not be displayed in the stage selector
    Given user lands on the Enrollment dashboard page by typing #/enrollment?enrollmentId=PAHlrkHc40G&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&teiId=H0YmvIuKqv0
    And there are four program stages
    And one of the program stages is non-repeatable
    When user lands on the EnrollmentEventNew-page without a stageId by typing #/enrollmentEventNew?enrollmentId=PAHlrkHc40G&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&teiId=H0YmvIuKqv0
    Then only three program stages are displayed in the stage selector widget

  Scenario: Program stage should be auto selected when only one stage is available
    Given user lands on the EnrollmentEventNew-page without a stageId by typing #/enrollmentEventNew?enrollmentId=RiNIt1yJoge&orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW&teiId=x2kJgpb0XQC
    Then the URL should contain stageId ZzYYXq4fJie

  @user:trackerAutoTestRestricted
  Scenario: Stages buttons should not be displayed when no data write access
    Given user lands on the Enrollment dashboard page by typing #/enrollmentEventNew?enrollmentId=X7g83OFRALm&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&teiId=YsKjdOcl9Cd
    Then the New event quick action button is disabled
