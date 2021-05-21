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
        And the user sees the enrollment status is Active
        And the user sees the enrollment date
        And the user sees the incident date
        And the user sees the enrollment organisation unit
        And the user sees the owner organisation unit
        And the user sees the last update date

    Scenario: User can modify the enrollment status
        Given you open the enrollment page
        Then the enrollment widget should be opened
        And the user opens the enrollment actions menu
        When the user changes the enrollment status to complete
        Then the user sees the enrollment status is Complete
        And the user opens the enrollment actions menu
        When the user changes the enrollment status to incomplete
        Then the user sees the enrollment status is Active
        And the user opens the enrollment actions menu
        When the user changes the enrollment status to cancel
        Then the user sees the enrollment status is Cancelled
        And the user opens the enrollment actions menu
        When the user changes the enrollment status to reactivate
        Then the user sees the enrollment status is Active

    Scenario: User can mark and remove for followup
        Given you open the enrollment page
        Then the enrollment widget should be opened
        And the user opens the enrollment actions menu
        When the user mark the enrollment for followup
        Then the user can see the enrollment is marked for follow up
        And the user opens the enrollment actions menu
        When the user remove the enrollment for followup
        Then the user can see the enrollment is not marked for follow up

    Scenario: User can open the delete modal
        Given you open the enrollment page
        Then the enrollment widget should be opened
        When the user opens the enrollment actions menu
        And the user clicks on the delete action
        Then the user sees the delete enrollment modal