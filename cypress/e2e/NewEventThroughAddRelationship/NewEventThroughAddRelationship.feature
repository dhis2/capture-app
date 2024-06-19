Feature: User adds events

    Scenario: User adds event in the malaria case registration program
        Given you open the the new event page in Ngelehun and malaria case context
        When you add data to the form
        And you submit the form
        Then the event should be sent to the server successfully

    # Scenario: User adds event with relationship to new person in the malaria case registration program
    #     Given you open the the new event page in Ngelehun and malaria case context
    #     When you add data to the form
    #     And you navigate to register a person relationship
    #     And you fill in the registration details
    #     And you submit the registration form
    #     And you submit the event form with the associated relationship to the newly created person
    #     Then the data should be sent to the server successfully

    Scenario: User adds event with relationship to existing person in the malaria case registration program
        Given you open the the new event page in Ngelehun and malaria case context
        When you add data to the form
        And you navigate to find a person relationship
        And you search for an existing unique id and link to the person
        And you submit the event form with the associated relationship to the already existing person
        Then the event and relationship should be sent to the server successfully

    Scenario: User gets navigated correctly when clicking on the back button
        Given you open the the new event page in Ngelehun and malaria case context
        When you navigate to register a person relationship
        And you click the cancel button
        Then you should be navigated back to the event form
