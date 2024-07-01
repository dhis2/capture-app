Feature: User interacts with Enrollment Add event page
  Scenario: The user can land on the enrollment add event page.
    Given you land on the enrollment add event page by having typed /#/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=tIJu6iqQxNV&enrollmentId=CCBLMntFuzb&stageId=A03MvHHogjR
    Then you see the following Enrollment: New Event
    And you see the widget header Birth
    And you see the following Report date
    And you see the add event form details
