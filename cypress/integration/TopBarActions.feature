Feature: User uses the TopBarActions to navigate

    Scenario: Enrollment page > Clear selections
        Given you land on a enrollment page domain by having typed /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: Clear selections
        Then the current url is /#/

    Scenario: Enrollment page > The user searchs for a tei inside the same program
        Given you land on a enrollment page domain by having typed /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: Search
        And the user clicks the element containing the text: Search for a person in Child Programme
        Then the current url is /#/search?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8

    Scenario: Enrollment page > You go to the search page without a program selected
        Given you land on a enrollment page domain by having typed /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: Search
        And the user clicks the element containing the text: Search...
        Then the current url is /#/search?orgUnitId=DiszpKrYNg8

    Scenario: Enrollment page > You go to the new page without a program selected
        Given you land on a enrollment page domain by having typed /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: New
        And the user clicks the element containing the text: New...
        Then the current url is /#/new?orgUnitId=DiszpKrYNg8

    Scenario: Enrollment page > You go to the new page inside the same program
        Given you land on a enrollment page domain by having typed /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: New
        And the user clicks the element containing the text: New person in Child Programme
        Then the current url is /#/new?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8

    Scenario: Enrollment Event Edit page > Clear selections
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&teiId=yFcOhsM1Yoa&enrollmentId=ek4WWAgXX5i&stageId=edqlbukwRfQ&eventId=KNbStF7YTon
        When the user clicks the element containing the text: Clear selections
        Then the current url is /#/

    Scenario: Enrollment Event Edit page > The user searchs for a tei inside the same program
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&teiId=yFcOhsM1Yoa&enrollmentId=ek4WWAgXX5i&stageId=edqlbukwRfQ&eventId=KNbStF7YTon
        When the user clicks the element containing the text: Search
        And the user clicks the element containing the text: Search for a person in WHO RMNCH Tracker
        Then the current url is /#/search?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy

    Scenario: Enrollment Event Edit page > You go to the search page without a program selected
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&teiId=yFcOhsM1Yoa&enrollmentId=ek4WWAgXX5i&stageId=edqlbukwRfQ&eventId=KNbStF7YTon
        When the user clicks the element containing the text: Search
        And the user clicks the element containing the text: Search...
        Then the current url is /#/search?orgUnitId=DwpbWkiqjMy

    Scenario: Enrollment Event Edit page > You go to the new page without a program selected
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&teiId=yFcOhsM1Yoa&enrollmentId=ek4WWAgXX5i&stageId=edqlbukwRfQ&eventId=KNbStF7YTon
        When the user clicks the element containing the text: New
        And the user clicks the element containing the text: New...
        Then the current url is /#/new?orgUnitId=DwpbWkiqjMy

    Scenario: Enrollment Event Edit page > You go to the new page inside the same program
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&teiId=yFcOhsM1Yoa&enrollmentId=ek4WWAgXX5i&stageId=edqlbukwRfQ&eventId=KNbStF7YTon
        When the user clicks the element containing the text: New
        And the user clicks the element containing the text: New person in WHO RMNCH Tracker
        Then the current url is /#/new?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy

    Scenario: Enrollment Event edit page > When the user performs any actions in edit mood a popup warning message will appear.
        Given you land on a enrollment page domain by having typed #enrollmentEventEdit?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&teiId=yFcOhsM1Yoa&enrollmentId=ek4WWAgXX5i&stageId=edqlbukwRfQ&eventId=KNbStF7YTon  
        And the user see the following text: WHOMCH Gestational age at visit
        When the user clicks on the edit button
        And the user see the following text: Enrollment: Edit Event
        When the user clicks the element containing the text: Clear selections
        Then the user sees the warning popup
