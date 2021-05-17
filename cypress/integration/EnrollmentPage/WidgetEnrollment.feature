Feature: User interacts with Enrollment Widget

    Scenario: User can close the Enrollment Widget
        Given you open the enrollment page
        When you click the enrollment widget toggle open close button
        Then the enrollment widget should be closed

    Scenario: User can close and reopen the Enrollment Widget
        Given you open the enrollment page
        When you click the enrollment widget toggle open close button
        And you click the enrollment widget toggle open close button
        Then the enrollment widget should be opened

    Scenario: User can see the enrollment details
        Given you open the enrollment page
        Then the enrollment widget should be opened
        And the user sees the enrollment status
        And the user sees the enrollment date
        And the user sees the incident date
        And the user sees the enrollment organisation unit
        And the user sees the owner organisation unit
        And the user sees the last update date
