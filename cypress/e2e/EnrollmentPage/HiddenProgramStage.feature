Feature: Hidden program stage

    Scenario: The user cannot add an event in a hidden program stage
        Given you add an enrollment event that will result in a rule effect to hide a program stage
        Then the New Postpartum care visit event button is disabled in the stages and events widget
        And the Postpartum care visit button is disabled in the enrollmentEventNew page
