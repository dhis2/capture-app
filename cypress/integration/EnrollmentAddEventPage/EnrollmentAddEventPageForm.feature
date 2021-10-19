Feature: User interacts with the Enrollment New Event Workspace

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
