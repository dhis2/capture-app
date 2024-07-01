Feature: the user interacts with the "view all records regardless of OrgUnit"-page.

    Scenario: The working list are hidden by default
        Given the user is on the the main page
        Then the working list should not be displayed

    Scenario: A message will be shown when OrgUnit is not selected
        Given the user is on the the main page
        When the user selects the program Antenatal care visit
        Then the IncompleteSelections-box should be displayed

    Scenario: The working list will hydrate when event program is selected
        Given the user is on the the main page
        When the user selects the program Malaria case registration
        And the user clicks the show accessible button
        Then the working list should be displayed

    Scenario: The working list will hydrate when tracker program is selected
        Given the user is on the the main page
        When the user selects the program Child Programme
        And the user clicks the show accessible button
        Then the working list should be displayed

    Scenario: the working list will hydrate when updated by the URL
        Given the user navigates to /#/?programId=VBqh0ynB2wv&all
        Then the working list should be displayed

    # Scenario: The user can edit an event without selecting OrgUnit
    #     Given the user is on the the main page
    #     When the user selects the program Antenatal care visit
    #     And the user clicks the show accessible button
    #     Then the working list should be displayed
    #     When the user clicks a row
    #     And edits and save the form
    #     And navigates back to the main page
    #     Then the working list should be updated
