Feature: User interacts with the informational widgets

  Scenario: The user land on the add Event in Enrollment Page
    Given you land on the enrollment event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg&teiId=EaOyKGOIGRp&enrollmentId=IMEGtAd4DOj&stageId=ZzYYXq4fJie&eventId=vDGrlVeyE2Q
    Then you see the widget with data-test feedback-widget
    And you see the widget with data-test indicator-widget
    And you see the widget with data-test profile-widget
    And you see the widget with data-test widget-enrollment
