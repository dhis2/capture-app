Feature: User interacts with Stages and Events Widget

    Scenario: User can view program stages
        Given you open the enrollment page
        Then the program stages should be displayed

    Scenario: User can close the Stages and Events Widget
        Given you open the enrollment page
        When you click the stages and events widget toggle open close button
        Then the stages and events widget should be closed

    Scenario: User can close and reopen the Stages and Events Widget
        Given you open the enrollment page
        When you click the stages and events widget toggle open close button
        And you click the stages and events widget toggle open close button
        Then the program stages should be displayed

    Scenario: User can view the list of events
        Given you open the enrollment page which has multiples events and stages
        Then you see the first 5 events in the table
        Then you see the first 5 rows in Antenatal care visit event
        Then you see buttons in the footer list

    Scenario: User can view more events
        Given you open the enrollment page which has multiples events and stages
        When you click show more button in stages&event list
        Then more events should be displayed
        Then reset button should be displayed

    Scenario: User can reset events
        Given you open the enrollment page which has multiples events and stages
        When you click show more button in stages&event list
        And you click reset button
        Then there should be 5 rows in the table
