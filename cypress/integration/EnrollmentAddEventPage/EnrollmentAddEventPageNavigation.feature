Feature: User interacts with Enrollment Add event page
  Scenario: The user can land on the enrollment add event page.
    Given you land on the enrollment event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg&teiId=EaOyKGOIGRp&enrollmentId=IMEGtAd4DOj&stageId=ZzYYXq4fJie&eventId=vDGrlVeyE2Q
    Then you see the following Enrollment: New Event
    And you see the widget header Baby Postnatal
