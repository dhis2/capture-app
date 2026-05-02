Feature: User interacts with event working lists

Scenario: User opens the default working list for an event program
Given you open the main page with Ngelehun and malaria case context
Then the default working list should be displayed
And rows per page should be set to 15
And for an event program the page navigation should show that you are on the first page

Scenario: Show only events assigned to anyone using the predefined working list
Given you open the main page with Ngelehun and malaria case context
When you select the working list called events assigned to anyone
Then the assigned to filter button should show that the anyone filter is in effect
And the list should display events assigned to anyone
And rows per page should be set to 15
And for an event program the page navigation should show that you are on the first page

Scenario: Show only events assigned to anyone using the filter
Given you open the main page with Ngelehun and malaria case context
When you set the assignee filter to anyone
And you apply the current filter
Then the assigned to filter button should show that the anyone filter is in effect
And the list should display events assigned to anyone
And rows per page should be set to 15
And for an event program the page navigation should show that you are on the first page

Scenario: Show only active events assigned to anyone using the filter
Given you open the main page with Ngelehun and malaria case context
When you set the assignee filter to anyone
And you apply the current filter
And you set the status filter to active
And you apply the current filter
Then the assigned to filter button should show that the anyone filter is in effect
And the status filter button should show that the active filter is in effect
And the list should display active events that are assigned to anyone
And rows per page should be set to 15
And for an event program the page navigation should show that you are on the first page

Scenario: Show only events where age is between 10 and 20 using the filter
Given you open the main page with Ngelehun and malaria case context
When you set the age filter to 10-20
And you apply the current filter
Then the age filter button should show 10 to 20 in effect
And the list should display events where age is between 10 and 20
And rows per page should be set to 15
And for an event program the page navigation should show that you are on the first page

Scenario: Show the Household location column
Given you open the main page with Ngelehun and malaria case context
When you open the column selector
And you select Household location and save from the column selector
Then Household location should display in the list

Scenario: Show next page
Given you open the main page with Ngelehun and malaria case context
When you click the next page button
Then the list should display data for the second page
And the pagination for the event working list should show the second page

Scenario: Show next page then previous page
Given you open the main page with Ngelehun and malaria case context
When you click the next page button
Then the list should display data for the second page
And the pagination for the event working list should show the second page
When you click the previous page button
Then the default working list should be displayed
And for an event program the page navigation should show that you are on the first page

Scenario: Show next page then first page
Given you open the main page with Ngelehun and malaria case context
When you click the next page button
Then the list should display data for the second page
And the pagination for the event working list should show the second page
When you click the first page button
Then the default working list should be displayed
And for an event program the page navigation should show that you are on the first page

Scenario: Show 10 rows per page
Given you open the main page with Ngelehun and malaria case context
When you change rows per page to 10
Then the list should display 10 rows of data
And for an event program the page navigation should show that you are on the first page

Scenario: Show events ordered ascendingly by report date
Given you open the main page with Ngelehun and malaria case context
When you click the report date column header
Then the sort arrow should indicate ascending order
And the list should display data ordered descendingly by report date
And for an event program the page navigation should show that you are on the first page

Scenario: Ensure sharing settings are preserved when updating a working list
Given you open the main page with Ngelehun and malaria case context
When you select the working list called Events today
And you create a copy of the working list
And you change the sharing settings
And you update the working list
Then your newly defined sharing settings should still be present

Scenario: Save and load view with stored WL filters - TEXT
  Given you open the main page with Ngelehun and event program text filter context
  When you set the text filter "XX MAL RDT TRK - Reason for not testing" to "test"
  And you save the view as textFilterWorkingList
  And you refresh the page
  And you open the saved view textFilterWorkingList
  Then the text filter "XX MAL RDT TRK - Reason for not testing" should be in effect and show "test" when opened
  And the saved working list view is cleaned up

@v>=42
Scenario: Save and load view with stored WL filters - BOOLEAN, INTEGER, NUMBER, INTEGER_POSITIVE, DATE, ORGANISATION_UNIT, COORDINATE, FILE_RESOURCE
  Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
  When you set the boolean filter
  And you set the range filter "Age (years)" to 0-120
  And you set the range filter "Height in cm" to 100-200
  And you set the range filter "Weight in kg" to 1-200
  And you set the date filter
  And you set the organisation unit filter
  And you set the empty-only filter "Household location" to Is empty
  And you set the empty-only filter "Documentation" to Is empty
  And you save the view as allValueTypesFilterWorkingList
  And you refresh the page
  And you open the saved view allValueTypesFilterWorkingList
  Then the boolean filter should be in effect and show the correct value when opened
  And the range filter "Age (years)" should be in effect and show 0 to 120 when opened
  And the range filter "Height in cm" should be in effect and show 100 to 200 when opened
  And the range filter "Weight in kg" should be in effect and show 1 to 200 when opened
  And the date filter should be in effect and show the correct value when opened
  And the organisation unit filter should be in effect and show the correct value when opened
  And the empty-only filter "Household location" should be in effect and show Is empty when opened
  And the empty-only filter "Documentation" should be in effect and show Is empty when opened
  And the saved working list view is cleaned up

@v<42
Scenario: Save and load view with stored WL filters - BOOLEAN, INTEGER, NUMBER, INTEGER_POSITIVE, DATE, ORGANISATION_UNIT
  Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
  When you set the boolean filter
  And you set the range filter "Age (years)" to 0-120
  And you set the range filter "Height in cm" to 100-200
  And you set the range filter "Weight in kg" to 1-200
  And you set the date filter
  And you set the organisation unit filter
  And you save the view as valueTypesNoEmpty
  And you refresh the page
  And you open the saved view valueTypesNoEmpty
  Then the boolean filter should be in effect and show the correct value when opened
  And the range filter "Age (years)" should be in effect and show 0 to 120 when opened
  And the range filter "Height in cm" should be in effect and show 100 to 200 when opened
  And the range filter "Weight in kg" should be in effect and show 1 to 200 when opened
  And the date filter should be in effect and show the correct value when opened
  And the organisation unit filter should be in effect and show the correct value when opened
  And the saved working list view is cleaned up

@v<42
Scenario: EMPTY_ONLY filter types (COORDINATE, FILE_RESOURCE, IMAGE, URL) are not visible in filter list - Event
  Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
  When you open the More filters menu on the event working list
  Then the filter option "Household location" should not appear in the More filters menu
  And the filter option "Documentation" should not appear in the More filters menu

Scenario: User is promted with message to select Category
Given you open the main page with Ngelehun and Contraceptives Voucher Program
Then you are told to select Implementing Partner

Scenario: The user can see the working list when selecting Category
Given you open the main page with Ngelehun and Contraceptives Voucher Program
When the user selects CARE International
Then the working list should be displayed

Scenario: The user can delete a working list right immediately after creating it.
Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
When you set the date of admission filter
And you save the view as toDeleteWorkingList
When you delete the name toDeleteWorkingList
Then the custom events working list is deleted
