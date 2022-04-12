Feature: User interacts with Main page

    Scenario: The Working list is displayed 
        Given you are in the main page with Child program preselected
        Then the working list is displayed

    Scenario: The Working list is displayed for an event program
        Given you are in the main page with Antenatal care program preselected
        Then the working list is displayed

    Scenario: The Working list is displayed when there is no programin the context
        Given you are in the main page without a program preselected
        Then the working list is displayed

    Scenario: The Search form is displayed
        Given you are in the main page with MNCH PNC program preselected
        Then the search form is displayed