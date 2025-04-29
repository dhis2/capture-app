Feature: User facing tests for bulk actions on Tracked Entity working lists

  Scenario: the user should be able to select rows
    Given you open the main page with Ngelehun and child programe context
    When you select the first 5 rows
    Then the bulk action bar should say 5 selected
    And the first 5 rows should be selected

  Scenario: the user should be able to deselect rows
    Given you open the main page with Ngelehun and child programe context
    When you select the first 5 rows
    And you deselect the first 3 rows
    Then the bulk action bar should say 2 selected

  Scenario: the user should be able to select all rows
    Given you open the main page with Ngelehun and child programe context
    When you select all rows
    Then the bulk action bar should say 15 selected
    And all rows should be selected

  Scenario: the user should be able to deselect all rows
    Given you open the main page with Ngelehun and child programe context
    When you select all rows
    And all rows should be selected
    And you select all rows
    Then the bulk action bar should not be present
    And no rows should be selected

  Scenario: the filters should be disabled when rows are selected
    Given you open the main page with Ngelehun and child programe context
    When you select the first 5 rows
    Then the filters should be disabled

#DHIS2-18447
@skip
  Scenario: The user should see an error message when trying to bulk complete enrollments with errors
    Given you open the main page with Ngelehun and Malaria focus investigation context
    And you select the first 3 rows
    And you click the bulk complete enrollments button
    And the bulk complete enrollments modal should open
    And the modal content should say: This action will complete 2 active enrollments in your selection. 1 enrollment already marked as completed will not be changed.
    When you confirm 2 active enrollments with errors
    Then an error dialog will be displayed to the user
    And you close the error dialog
    And the unsuccessful enrollments should still be selected

  Scenario: the user should be able to bulk complete enrollments and events
    Given you open the main page with Ngelehun and Malaria focus investigation context
    And you select the first 4 rows
    And you click the bulk complete enrollments button
    And the bulk complete enrollments modal should open
    And the modal content should say: This action will complete 3 active enrollments in your selection. 1 enrollment already marked as completed will not be changed.
    When you confirm 3 active enrollments successfully
    Then the bulk complete enrollments modal should close

#DHIS2-18447
@skip
  Scenario: the user should be able to bulk complete enrollments without completing events
    Given you open the main page with Ngelehun and Malaria Case diagnosis context
    And you select row number 1
    And you click the bulk complete enrollments button
    And the bulk complete enrollments modal should open
    And you deselect the complete events checkbox
    And the modal content should say: This action will complete 1 active enrollment in your selection.
    When you confirm 1 active enrollment without completing events successfully
    Then the bulk complete enrollments modal should close

#DHIS2-18447
@skip
  Scenario: the user should be able to bulk delete enrollments
    Given you open the main page with Ngelehun and Malaria Case diagnosis context
    And you select the first 3 rows
    And you click the bulk delete enrollments button
    And the bulk delete enrollments modal should open
    When you confirm deleting 3 enrollments
    Then the bulk delete enrollments modal should close

#DHIS2-18447
@skip
  Scenario: the user should be able to bulk delete only active enrollments
    Given you open the main page with Ngelehun and Malaria Case diagnosis context
    And you select the first 3 rows
    And you click the bulk delete enrollments button
    And the bulk delete enrollments modal should open
    When you deselect completed enrollments
    And you confirm deleting 2 active enrollments
    Then the bulk delete enrollments modal should close

  @user:trackerAutoTestRestricted
  Scenario: a restricted user should not be able to bulk delete enrollments
    Given you open the main page with Ngelehun and WHO RMNCH Tracker context
    And you open the working lists
    When you select the first 3 rows
    Then the bulk delete enrollments button should not be visible

  @with-indexBD-clean
  Scenario: User open trackedEntities page in bulk data entry
      Given you open the main page with Ngelehun and child programe context
      And the BulkDataEntry widget in idle mode is displayed
      And the user selects the "Routine visit" BulkDataEntry from the "Open page in bulk data entry" dropdown
      When the user navigates to "Program overview" using the breadcrumb
      And the user click the "Add page to ongoing bulk data entry" button
      When the user navigates to "Program overview" using the breadcrumb
      Then the BulkDataEntry widget in active mode is displayed

  @with-indexBD-clean
  Scenario: User open selected trackedEntities rows in bulk data entry
      Given you open the main page with Ngelehun and child programe context
      And the BulkDataEntry widget in idle mode is displayed
      When you select the first 2 rows
      And the user selects the "Routine visit" BulkDataEntry from the "Open in bulk data entry" dropdown
      When the user navigates to "Program overview" using the breadcrumb
      When you select all rows
      And the other enrollment bulk actions buttons are disabled
      And the user click the "Add to ongoing bulk data entry" button
      When the user navigates to "Program overview" using the breadcrumb
      And the BulkDataEntry widget in active mode is displayed

  @with-indexBD-clean
  Scenario: User open program stage events page in bulk data entry
      Given you open the main page with Ngelehun and child program context and configure a program stage working list
      And the BulkDataEntry widget in idle mode is displayed
      And the user selects the "Routine visit" BulkDataEntry from the "Open page in bulk data entry" dropdown
      When the user navigates to "Program overview" using the breadcrumb
      And the user click the "Add page to ongoing bulk data entry" button
      When the user navigates to "Program overview" using the breadcrumb
      Then the BulkDataEntry widget in active mode is displayed

  @with-indexBD-clean
  Scenario: User open selected program stage event rows in bulk data entry
      Given you open the main page with Ngelehun and child program context and configure a program stage working list
      And the BulkDataEntry widget in idle mode is displayed
      When you select the first 2 rows
      And the user selects the "Routine visit" BulkDataEntry from the "Open in bulk data entry" dropdown
      When the user navigates to "Program overview" using the breadcrumb
      When you select all rows
      And the other event bulk actions buttons are disabled
      And the user click the "Add to ongoing bulk data entry" button
      When the user navigates to "Program overview" using the breadcrumb
      And the BulkDataEntry widget in active mode is displayed
