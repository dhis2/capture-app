Feature: The user interacts with the widgets Schedule tab

    # Blocked by DHIS2-16229
    @skip
    Scenario: User cancel after choose a schedule date in schedule tab
        Given you land on the enrollment add event page by having typed #/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp&enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR&tab=SCHEDULE
        Then you should see Schedule tab
        Then you choose a schedule date
        When you click cancel in Schedule tab
        Then you should see confirm dialog
