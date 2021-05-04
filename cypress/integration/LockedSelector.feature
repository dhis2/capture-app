Feature: User uses the LockedSelector to navigate

  # Main page
  Scenario: Main page > Notifying that you need to select org unit and program to get started
    Given you are in the main page with no selections made
    When you click the "New" button to add a new event
    Then you should see informative text saying you should do finish your selections

  Scenario: Main page > Notifying that you need to select a program to get started
    Given you are in the main page with organisation unit preselected
    When you click the "New" button to add a new event
    Then you should be taken to the new page
    And you see the dropdown menu for selecting tracked entity type

  Scenario: Main page >  Notifying that you need to select an org unit to get started
    Given you are in the main page with program preselected
    When you click the first option from the "New" button to add a new event
    Then you should see informative text saying you should do finish your selections

  Scenario: Main page > Clicking start again takes you to the main page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you click the "Start again" button
    Then you should be taken to the main page

  Scenario: Main page > Selecting org unit and program and seeing table
    Given you are in the main page with no selections made
    When you select both org unit and program Malaria case registration
    Then you should see the table

  Scenario: Main page > Url with invalid program id
    Given you land on a main page with an invalid program id
    Then you should see error message

  Scenario: Main page > Url with invalid org unit id
    Given you land on a main page with an invalid org unit id
    Then you should see error message

  Scenario: Main page > Selecting program preselected org unit
    Given you land on a main event page with preselected org unit
    When you select program
    Then main page page url is valid
    And you can see the new event page

  Scenario: Main page > Selecting org unit with preselected program
    Given you land on a main event page with preselected program
    When you select org unit
    Then main page page url is valid
    And you can see the new event page

  Scenario: Main page > Clicking the find button while having an Event type of program preselected
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you click the find button
    Then you navigated to the search page without a program being selected

  Scenario: Main page >  Clicking the find button while having an Tracker type of program preselected
    Given you are in the main page with no selections made
    And you select both org unit and program Child Programme
    When you click the find button from the dropdown menu
    Then you are navigated to the search page with the same org unit and program Child Programme
    And there should be visible a title with Child Program
    And there should be Child Programme domain forms visible to search with

  Scenario: Main page > Having a program preselected, select an org unit which does not contain the program
    Given you land on a main event page with preselected program
    When you select org unit that is incompatible with the already selected program
    Then you can see message on the locked selector

  # New Event page
  Scenario: New event page > Landing on the page
    Given you are in the main page with no selections made
    When you select both org unit and program Malaria case registration
    And you click the first option from the "New" button to add a new event
    Then you can see the new event page

  Scenario: New event page > Clicking the cancel button
    Given you are in the new event page with no selections made
    When you click the cancel button
    Then you should be taken to the main page

  Scenario: New event page > Selecting program while org unit is preselected
    Given you land on a new event page with preselected org unit
    When you select program
    Then new event page url is valid
    And you can see the new event page

  Scenario: New event page > Selecting org unit while program is preselected
    Given you land on a new event page with preselected program
    When you select org unit
    Then new event page url is valid
    And you can see the new event page

  Scenario: New event page > Url with invalid program id
    Given you land on a new event page with an invalid program id
    Then you should see error message

  Scenario: New event page > Url with invalid org unit id
    Given you land on a new event page with an invalid org unit id
    Then you should see error message

  # View Event page
  Scenario: View event page > Landing on the page
    Given you land on a view event page from the url
    Then you can see the view event page

  Scenario: View event page > Selecting the first entry of the events
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you select the first entity from the table
    Then you can see the view event page

  Scenario: View event page > Clicking the start again button after you navigated to the page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    When you select the first entity from the table
    And you click the "Start again" button
    Then you should be taken to the main page

  Scenario: View event page > Removing the program selection after you navigated to the page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    And you select the first entity from the table
    When you remove the program selection
    Then you should be taken to the main page with only org unit selected

  Scenario: View event page > Removing the org unit selection after you navigated to the page
    Given you are in the main page with no selections made
    And you select both org unit and program Malaria case registration
    And you select the first entity from the table
    When you remove the org unit selection
    Then you should be taken to the main page with only program selected

  Scenario: View event page > Url with invalid event id
    Given you land on a view event page with an invalid id
    Then you should see error message

  # Enrollment page
  Scenario Outline: Enrollment page > Landing on the page with url
    Given you land on the enrollment page by having typed the <url>
    Then you see the following <message>
    And you can see on the locked selector the following <state>

    Examples:
        | url | state | message |
      | /#/enrollment?enrollmentId=gPDueU02tn8                                                                | all                  | Enrollment Dashboard |
      | /#/enrollment?teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8                                              | all                  | Enrollment Dashboard |
      | /#/enrollment?orgUnitId=UgYg0YW7ZIh&enrollmentId=gPDueU02tn8                                          | all                  | Enrollment Dashboard |
      | /#/enrollment?orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8                        | all                  | Enrollment Dashboard |
      | /#/enrollment?programId=IpHINAT79UW&enrollmentId=gPDueU02tn8                                          | all                  | Enrollment Dashboard |
      | /#/enrollment?programId=IpHINAT79UW&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8                        | all                  | Enrollment Dashboard |
      | /#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&enrollmentId=gPDueU02tn8                    | all                  | Enrollment Dashboard |
      | /#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8  | all                  | Enrollment Dashboard |
      | /#/enrollment?orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ                                                 | teiAndOrgUnit        | Carlos Cruz is enrolled in multiple programs. Choose a program. |
      | /#/enrollment?programId=IpHINAT79UW&teiId=fhFQhO0xILJ                                                 | teiAndChildProgram   | There are multiple enrollments for this program. Choose an enrollment to view the dashboard. |
      | /#/enrollment?programId=qDkgAbB5Jlk&teiId=fhFQhO0xILJ                                                 | teiAndMalariaProgram | Carlos Cruz is a person and cannot be enrolled in the Malaria case diagnosis, treatment and investigation. Choose another program that allows person enrollment. Enroll a new malaria entity in this program.|
      | /#/enrollment?programId=lxAQ7Zs9VYR&teiId=fhFQhO0xILJ                                                 | teiAndEventProgram   | Antenatal care visit is an event program and does not have enrollments. |

  Scenario: Enrollment page > resetting the tei
    Given you land on the enrollment page by having typed only the enrollmentId on the url
    When you reset the tei selection
    And you navigated to the main page

  Scenario: Enrollment page > resetting the program
    Given you land on the enrollment page by having typed only the enrollmentId on the url
    When you reset the program selection
    And you see message explaining you need to select a program

  Scenario: Enrollment page > resetting the org unit
    Given you land on the enrollment page by having typed only the enrollmentId on the url
    When you reset the org unit selection
    And you see the enrollment page but there is no org unit id in the url

  Scenario: Enrollment page > resetting the enrollment
    Given you land on the enrollment page by having typed only the enrollmentId on the url
    When you reset the enrollment selection
    And you see message explaining you need to select an enrollment

  Scenario: Enrollment page > navigating using the locked selector
    Given you land on the enrollment page by having typed only the enrollmentId on the url
    When you reset the program selection
    And you select the MNCH PNC program
    Then you see message explaining there are no enrollments for this program
    When you reset the program selection
    And you select the Antenatal care visit
    Then you see message explaining this is an Event program
    When you reset the program selection
    And you select the Child Programme
    And you see the enrollment page
