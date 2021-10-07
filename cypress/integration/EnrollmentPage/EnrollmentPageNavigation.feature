Feature: User interacts with Enrollment page

  Scenario: Navigating to the registration page for new event by clicking the link button
    Given you are on an enrollment page
    And you reset the program selection
    And you select the Inpatient morbidity program
    When you choose to register a new event program by clicking the link button
    Then you see the registration form for the Inpatient morbidity program

  Scenario: Navigating to the working lists page for new event by clicking the link button
    Given you are on an enrollment page
    And you reset the program selection
    And you select the Inpatient morbidity program
    When you choose to be navigated to the working list by clicking the link button
    Then you see the working lists for the Inpatient morbidity program

  Scenario: Navigating to the enrollment page for the same tet by clicking the link button
    Given you are on an enrollment page
    And you reset the program selection
    When you select the MNCH PNC program
    When you choose to enroll a person by clicking the link button
    Then you see the registration form for the MNCH PNC program

  Scenario: Navigating to the enrollment page for a different tet by clicking the link button
    Given you are on an enrollment page
    And you reset the program selection
    When you select the Malaria case diagnosis program
    When you choose to enroll a malaria entity by clicking the link button
    Then you see the registration form for the Malaria case diagnosis

  Scenario: Auto select an enrollment when opening enrollment dashboard
    # when the link between capture and tracker-capture is removed we can test by click from the main page
    Given you enter enrollment page by typing: #/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=AUTO
    Then you should be redirect to #/enrollment?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=pybd813kIWx&enrollmentId=FS085BEkJo2
