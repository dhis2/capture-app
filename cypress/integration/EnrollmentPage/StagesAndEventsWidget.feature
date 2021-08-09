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
        Then the default list should be displayed
        And you see the first 5 events in the table
        And you see the first 5 rows in Antenatal care visit event
        And you see buttons in the footer list

    Scenario: User can view more events
        Given you open the enrollment page which has multiples events and stages
        When you click show more button in stages&event list
        Then more events should be displayed
        And reset button should be displayed

    Scenario: User can reset events
        Given you open the enrollment page which has multiples events and stages
        When you click show more button in stages&event list
        And you click reset button
        Then there should be 5 rows in the table

    Scenario: User can sort the list of events
        Given you open the enrollment page which has multiples events and stages
        Then the default list should be displayed
        When you sort list asc by Report date
        Then the sorted list by Report date asc should be displayed

    Scenario: User can go to Program Stage list by clicking Go to full
        Given you open the enrollment page which has multiples events and stages
        When you click button Go to full Antenatal care visit
        Then you should navigate to Program Stage list page

    Scenario: User can go to Add new page by clicking New event in stage
        Given you open the enrollment page which has multiples events and stages
        When you click New Antenatal care visit event
        Then you should navigate to Add new page