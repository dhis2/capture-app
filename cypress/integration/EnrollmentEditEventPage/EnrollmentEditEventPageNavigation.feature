Feature: User interacts with Enrollment event page

  Scenario: The user can land on the enrollment event page.
    Given you land on the enrollment event page by having typed #/enrollmentEventEdit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=tIJu6iqQxNV&enrollmentId=CCBLMntFuzb&stageId=ZzYYXq4fJie&eventId=O7IACPx40nQ
    Then you see the following Enrollment: View Event
    And you see the following Baby Postnatal

  Scenario: User can navigate back and forward between the enrollment event edit page and the enrollment page
    Given you open the enrollment page which has multiples events and stages
    And you see the following Enrollment Dashboard
    And the program stages should be displayed
    When the user clicks the first second antenatal care visit event
    Then you see the following Enrollment: View Event
    And you see the following antenatal care visit
    And you see the following No ARV medication plan
    When the user clicks the "Back to all stages and events" button
    Then you see the following Enrollment Dashboard
    And the program stages should be displayed
