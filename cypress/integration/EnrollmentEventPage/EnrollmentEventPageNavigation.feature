Feature: User interacts with Enrollment event page

  Scenario: The user can land on the enrollment event page.
    Given you land on the enrollment event page by having typed #/enrollment/event/edit?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=123&eventId=123
    Then you see the following Enrollment: View Event
