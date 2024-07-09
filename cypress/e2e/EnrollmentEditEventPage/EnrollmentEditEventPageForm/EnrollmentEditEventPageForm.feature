Feature: User interacts with Enrollment event page view/edit form

Scenario: The user can view the sections, the labels and the values in the form
Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?orgUnitId=DiszpKrYNg8&eventId=V1CerIi3sdL
And the user see the following text: Birth
And the user see the following text: Basic info
And the user see the following text: Report date
And the user see the following text: 02-27
And the user see the following text: Apgar Score
And the user see the following text: 11
And the user see the following text: Weight (g)
And the user see the following text: 3843
And the user see the following text: ARV at birth
And the user see the following text: NVP only
And the user see the following text: BCG dose
And the user see the following text: No
And the user see the following text: OPV dose
And the user see the following text: Dose 1
And the user see the following text: Infant Feeding
And the user see the following text: Replacement
And the user see the following text: Birth certificate
And the user see the following text: Status
And the user see the following text: Event completed
And the user see the following text: Yes

Scenario: The user can enter and exit the edit mode.
Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?orgUnitId=DiszpKrYNg8&eventId=V1CerIi3sdL
And the user see the following text: Enrollment: View Event
And the user see the following text: Apgar Score
When the user clicks on the edit button
Then the user see the following text: Enrollment: Edit Event
When the user clicks on the cancel button
And the user see the following text: Enrollment: View Event

Scenario: The tracker program rules are triggered correctly for the Child Program.
Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?orgUnitId=DiszpKrYNg8&eventId=V1CerIi3sdL
And the user see the following text: Apgar Score
When the user clicks on the edit button
And the user set the apgar score to 3
Then the user see the following text: It is suggested that an explanation is provided when the Apgar score is below 4
And the user set the apgar score to -1
Then the user see the following text: If the apgar score is below zero, an explanation must be provided.

Scenario: The tracker program rules are triggered correctly for the WHO RMNCH Tracker Program
Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?orgUnitId=DwpbWkiqjMy&eventId=KNbStF7YTon
And the user see the following text: Gestational age at visit
When the user clicks on the edit button
And the user don't see the following text: Low-dose acetylsalicylic acid given
When the user sets Plurality assessed to Twins
Then the user see the following text: Low-dose acetylsalicylic acid given
When the user sets Plurality assessed to Singleton
Then the user don't see the following text: Low-dose acetylsalicylic acid given

# DHIS2-17730
@skip
Scenario: User can modify and save the data in the form
Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?orgUnitId=DiszpKrYNg8&eventId=V1CerIi3sdL
Then the user see the following text: Enrollment: View Event
And the user see the following text: 11
When the user clicks on the edit button
And the user set the apgar score to 5
And the user clicks on the save button
Then you are redirected to the enrollment dashboard
And you open the Birth stage event
Then the user see the following text: Enrollment: View Event
And the user see the following text: 5
When the user clicks on the edit button
And the user set the apgar score to 11
And the user clicks on the save button
Then you are redirected to the enrollment dashboard
And you open the Birth stage event
Then the user see the following text: Enrollment: View Event
And the user see the following text: 11

 Scenario: User goes directly to Edit mode for scheduled events
    Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?eventId=RIrfCcEP8Uu&orgUnitId=DiszpKrYNg8
    Then the user see the following text: Enrollment: Edit Event
    And the user see the following text: Infant Feeding
    When the user clicks on the cancel button
    Then the user see the following text: Enrollment Dashboard

Scenario: User can update schedule date for a scheduled event 
    Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?eventId=RIrfCcEP8Uu&orgUnitId=DiszpKrYNg8
    Then the user see the following text: Enrollment: Edit Event
    And the user see the following text: Infant Feeding
    When the user clicks switch tab to Schedule
    And the user selects another schedule date
    And the user clicks on the schedule button on widget-enrollment-event
    Then the user see the following text: Enrollment Dashboard

Scenario: User can update schedule date if Hide due date is enabled
    Given you land on the enrollment event page with selected Focus area by having typed /#/enrollmentEventNew?enrollmentId=V8uPJuhvlL7&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&stageId=uvMKOn1oWvd&tab=SCHEDULE&teiId=dNpxRu1mWG5
    Then the user see the following text: Enrollment: New Event
    And the user see the following text: Foci response
    And the user see the schedule date and info box
    And the user clicks on the schedule button on add-event-enrollment-page-content
    Then the user see the following text: Enrollment Dashboard

Scenario: User can see disabled scheduled date for active event
    Given you land on the enrollment event page with selected Person by having typed /#/enrollmentEventEdit?eventId=FV4JCI73wO2&orgUnitId=DiszpKrYNg8
    Then the user see the following text: Enrollment: View Event 
    When the user clicks on the edit button
    Then the user see the following text: Enrollment: Edit Event
    Then the user see the schedule date field with tooltip: Scheduled date cannot be changed for Active events
    
Scenario: User can edit the event and complete the enrollment
    Given you land on the enrollment event page with selected Malaria Entity by having typed #/enrollmentEventEdit?eventId=MHR4Zj6KLz0&orgUnitId=DiszpKrYNg8
    And the enrollment status is active
    And the user clicks on the edit button
    And the user completes the event
    And the user completes the enrollment
    Then the user sees the enrollment status and recently edited event in Case outcome event status is completed