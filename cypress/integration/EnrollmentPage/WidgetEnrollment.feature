Feature: User interacts with Enrollment Widget

    Scenario: User can close the Enrollment Widget
        Given you open the enrollment page
        When you click the enrollment widget toggle open close button
        Then the enrollment widget should be closed

    Scenario: User can close and reopen the Enrollment Widget
        Given you open the enrollment page
        When you click the enrollment widget toggle open close button
        And you click the enrollment widget toggle open close button
        Then the enrollment details should be displayed
