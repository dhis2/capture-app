Feature: User interacts with Stages and Events Widget


    Scenario: User can view program stages
        Given you open the enrollment page
        Then the program stages should be displayed

    Scenario: User can close the Stages and Events Widget
        Given you open the enrollment page
        And the program stages should be displayed
        When you click the stages and events widget toggle open close button
        Then the stages and events widget should be closed

    Scenario: User can close and reopen the Stages and Events Widget
        Given you open the enrollment page
        And the program stages should be displayed
        When you click the stages and events widget toggle open close button
        Then the stages and events widget should be closed
        When you click the stages and events widget toggle open close button
        Then the program stages should be displayed

    Scenario: User can view the list of events
        Given you open the enrollment page which has multiples events and stages
        Then the default list should be displayed
        And you see the first 5 events in the table
        And you see buttons in the footer list

    Scenario: User can view more events
        Given you open the enrollment page which has multiples events and stages
        When you click show more button in stages&event list
        Then there should be 10 rows in the table

    Scenario: User can sort the list of events
        Given you open the enrollment page which has multiples events and stages
        Then the default list should be displayed
        When you sort list asc by Date of visit
        Then the sorted list by Date of visit asc should be displayed

    # DHIS2-11733
    @skip
    Scenario: User can go to Program Stage list by clicking Go to full
        Given you open the enrollment page which has multiples events and stages
        When you click button Go to full Antenatal care visit
        Then you should navigate to Program Stage list page

    Scenario: User can go to Add new page by clicking New event in stage
        Given you open the enrollment page which has multiples events and stages
        When you click New First antenatal care visit event
        Then you should navigate to Add new page #/enrollmentEventNew?enrollmentId=ek4WWAgXX5i&orgUnitId=DwpbWkiqjMy&programId=WSGAb5XwJ3Y&stageId=WZbXY0S00lP&teiId=yFcOhsM1Yoa

    Scenario: User can go to Add new page by clicking New event in stage even if there is no event
        Given you open the enrollment page which has multiples events and stages
        When you click New First antenatal care visit event
        Then you should navigate to Add new page #/enrollmentEventNew?enrollmentId=ek4WWAgXX5i&orgUnitId=DwpbWkiqjMy&programId=WSGAb5XwJ3Y&stageId=WZbXY0S00lP&teiId=yFcOhsM1Yoa

    Scenario: User can not go to Add new page if stage is not repeatable and there is event in the stage
        Given you open the enrollment page by typing #enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8
        Then you should see the disabled button New Birth event

    Scenario: User can skip a scheduled event
        Given you open the enrollment page by typing #/enrollment?enrollmentId=gL8BooqKhdX&orgUnitId=DiszpKrYNg8&programId=ur1Edk5Oe2n&teiId=RABlFsj5Omi
        And there is an Overdue event in the TB visit stage
        When you click the Skip event overflow button on the Overdue event
        Then the event should be skipped

    Scenario: User can unskip a scheduled event
        Given you open the enrollment page by typing #/enrollment?enrollmentId=gL8BooqKhdX&orgUnitId=DiszpKrYNg8&programId=ur1Edk5Oe2n&teiId=RABlFsj5Omi
        And there is an Skipped event in the TB visit stage
        When you click the Unskip event overflow button on the Skipped event
        Then there is an Overdue event in the TB visit stage

    @with-restore-deleted-event
    Scenario: User can delete an event
        Given you open the enrollment page by typing #/enrollment?enrollmentId=ITyaPVATEwc&orgUnitId=DiszpKrYNg8&programId=ur1Edk5Oe2n&teiId=wsk89u7zquT
        And there is an Active event in the TB visit stage
        When you click the Delete event overflow button on the Active event
        And you confirm you want to delete the event
        Then the TB visit stage should be empty

    @user:trackerAutoTestRestricted
    Scenario: Program stage is hidden if no data read access
        And you open the enrollment page by typing #enrollment?enrollmentId=iNEq9d22Nyp&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&teiId=k4ODejBytgv
        Then the Care at birth program stage should be hidden

    @user:trackerAutoTestRestricted
    Scenario: Create new event button is disabled if no data write access
        Given you open the enrollment page by typing #enrollment?enrollmentId=WKPoiZxZxNG&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&teiId=PgmUFEQYZdt
        Then you should see the disabled button New Previous deliveries event
