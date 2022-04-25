Feature: User interacts with Main page

    Scenario: The Working list is displayed 
        Given you are in the main page with no selections made
        And the user selects the program Child Programme
        And the user selects the org unit Ngelehun CHC
        Then the TEI working list is displayed

    Scenario: The Working list is displayed for an event program
        Given you are in the main page with no selections made
        And the user selects the program Antenatal care
        And the user selects the org unit Ngelehun CHC
        Then the event working list is displayed

    # Scenario: The Working list is displayed when there is no program in the context
    #     Given you are in the main page with no selections made
    #     And the user selects the org unit Ngelehun CHC
    #     Then the TEI working list is displayed

    Scenario: The Search form is displayed
        Given you are in the main page with no selections made
        And the user selects the program MNCH / PNC (Adult Woman)
        And the user selects the org unit Ngelehun CHC
        Then the search form is displayed