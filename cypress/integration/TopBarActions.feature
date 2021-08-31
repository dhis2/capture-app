  Feature: User uses the TopBarActions to navigate
  
    Scenario: Enrollment page > Clear selections
        Given you land on the enrollment page by having typed the /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: Clear selections
        Then the current url is /#/

    Scenario: Enrollment page > The user searchs for a tei inside the same program
        Given you land on the enrollment page by having typed the /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: Search
        And the user clicks the element containing the text: Search for a person in Child Programme
        Then the current url is /#/search?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8

    Scenario: Enrollment page > You go to the search page without a program selected
        Given you land on the enrollment page by having typed the /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: Search
        And the user clicks the element containing the text: Search...
        Then the current url is /#/search?orgUnitId=DiszpKrYNg8

    Scenario: Enrollment page > You go to the new page without a program selected
        Given you land on the enrollment page by having typed the /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: New
        And the user clicks the element containing the text: New...
        Then the current url is /#/new?orgUnitId=DiszpKrYNg8

    Scenario: Enrollment page > You go to the new page inside the same program
        Given you land on the enrollment page by having typed the /#/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
        When the user clicks the element containing the text: New
        And the user clicks the element containing the text: New person in Child Programme
        Then the current url is /#/new?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8