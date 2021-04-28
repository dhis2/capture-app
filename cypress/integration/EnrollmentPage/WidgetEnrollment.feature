Feature: User interacts with Widget Profile

    Scenario: User can close the Widget Profile
        Given you open the enrollment page
        When you click the widget profile toggle open close button
        Then the widget profile should be closed

    Scenario: User can close and reopen the Widget Profile
        Given you open the enrollment page
        When you click the widget profile toggle open close button
        And you click the widget profile toggle open close button
        Then the profile details should be displayed
