Feature: User interacts with the Enrollment New Event Workspace

  # DHIS2-17657
  @skip
  Scenario: User can complete a Lab monitoring Event
    Given you land on the enrollment new event page by having typed /#/enrollment?programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8&teiId=yGIeBkYzW2o&enrollmentId=Pm0VlgHBgRm
    And the enrollment overview is finished loading
    And you click the create new button number 0
    When you type 2021-10-15 in the input number 0
    And you click the checkbox number 0
    And you click the checkbox number 2
    And you click the Complete button
    Then all events should be displayed
    And the newest event in datatable nr 0 should contain Completed

  # DHIS2-17657
  @skip
  Scenario: User can save a Sputum smear microscopy test without completing
    Given you land on the enrollment new event page by having typed /#/enrollment?programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8&teiId=yGIeBkYzW2o&enrollmentId=Pm0VlgHBgRm
    And the enrollment overview is finished loading
    And you click the create new button number 2
    When you type 2021-10-15 in the input number 0
    And you type 13 in the input number 1
    And the user selects Positive
    And you click the Save without completing button
    Then all events should be displayed
    And the newest event in datatable nr 2 should contain Active
    And the newest event in datatable nr 2 should contain 13
    And the newest event in datatable nr 2 should contain Positive

  Scenario: Required fields should display an error when saving without data
    Given you land on the enrollment new event page by having typed /#/enrollment?programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8&teiId=yGIeBkYzW2o&enrollmentId=Pm0VlgHBgRm
    And the enrollment overview is finished loading
    And you click the create new button number 0
    And the form is finished loading
    When you click the button to Save without completing without post request
    Then the input should throw an error with error-message A value is required

  Scenario: Required fields should display an error when blurred without data
    Given you land on the enrollment new event page by having typed /#/enrollment?programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8&teiId=yGIeBkYzW2o&enrollmentId=Pm0VlgHBgRm
    And the enrollment overview is finished loading
    And you click the create new button number 2
    When you focus and blur a required field
    Then the input should throw an error with error-message A value is required

  Scenario: Rules should trigger when data is typed in input
    Given you land on the enrollment new event page by having typed /#/enrollment?programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8&teiId=yGIeBkYzW2o&enrollmentId=Pm0VlgHBgRm
    And the enrollment overview is finished loading
    And you click the create new button number 2
    And you type x in the input number 1
    Then the input should throw an error with error-message Please provide a positive integer

  Scenario: User should be asked to create new event after completing a stage and choose to cancel
    Given you land on the enrollment new event page by having typed #/enrollmentEventNew?enrollmentId=zRfAPUpjoG3&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&stageId=CWaAcQYKVpq&teiId=S3JjTA4QMNe
    And the data store is clean
    Then you see the following Enrollment: New Event
    And you see the widget header Foci investigation & classification
    And you type 2022-01-01 in the input number 0
    And you type x in the input number 20
    And you select Active in the select number 13
    And you click the button to Complete without post request
    Then there should be a modal popping up
    When you choose option No, cancel in the modal
    Then you will be navigate to page #/enrollment?enrollmentId=zRfAPUpjoG3&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&teiId=S3JjTA4QMNe

  Scenario: User should be asked to create new event after completing a stage and choose to continue
    Given you land on the enrollment new event page by having typed #/enrollmentEventNew?enrollmentId=zRfAPUpjoG3&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&stageId=CWaAcQYKVpq&teiId=S3JjTA4QMNe
    Then you see the following Enrollment: New Event
    And you see the widget header Foci investigation & classification
    And you type 2022-01-01 in the input number 0
    And you type x in the input number 20
    And you select Active in the select number 13
    And you click the button to Complete without post request
    Then there should be a modal popping up
    When you choose option Yes, create new event in the modal
    Then you will be navigate to page #/enrollmentEventNew?enrollmentId=zRfAPUpjoG3&orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&teiId=S3JjTA4QMNe

  Scenario: User is able to schedule an event with a note
    Given you land on the enrollment new event page by having typed /#/enrollmentEventNew?enrollmentId=qcFFRp7DpcX&orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&stageId=edqlbukwRfQ&teiId=erqa3phUfpI
    And you see the following Enrollment: New Event
    And you select the schedule tab
    When you add a comment to the event
    And the events saves successfully

  Scenario: User can add a new event and complete the enrollment
    Given you land on the enrollment new event page by having typed #/enrollmentEventNew?enrollmentId=FZAa7j0muDj&orgUnitId=DiszpKrYNg8&programId=qDkgAbB5Jlk&stageId=eHvTba5ijAh&teiId=bj4UmUpqaSp
    And the enrollment status is active
    And you type 2021-10-15 in the input number 0
    And you select Died in the select number 0
    And the user completes the event
    And the user completes the enrollment
    Then the user sees the enrollment status and recently added event in Case outcome event status is completed
