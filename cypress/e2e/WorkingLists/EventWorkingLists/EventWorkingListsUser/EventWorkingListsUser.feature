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
Then the age filter button should show that the filter is in effect
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

Scenario: Save and load a view with date, org unit, integer and coordinate filters
Given you open the main page with Ngelehun and malaria case context
When you set the report date filter
And you set the Organisation unit filter to Ngelehun
And you set the age filter to 20-30
And you apply the current filter
And you set the Household location filter to Is empty
And you apply the current filter
And you save the view as dateFilterWorkingList
And you refresh the page
And you open the saved view dateFilterWorkingList
Then the list should display one record with report date matching filter
Then the report date filter should be in effect
And the Organisation unit filter should be in effect
And the age filter button should show 20 to 30 in effect
And the Household location filter button should show that the filter is in effect
And the Household location filter should show Is empty checked
And the saved working list view is cleaned up

Scenario: Save and load a view with boolean and number filters
Given you open the main page with Ngelehun and program with boolean and number types
When you set the WHOMCH Smoking filter to Yes
And you set the WHOMCH Hemoglobin value filter to 1-100
And you save the view as booleanNumberFilterWorkingList
And you refresh the page
And you open the saved view booleanNumberFilterWorkingList
Then the WHOMCH Smoking filter should show Yes in effect
And the WHOMCH Hemoglobin value filter should show 1 to 100 in effect
And the WHOMCH Smoking filter should show Yes radio checked when opened
And the WHOMCH Hemoglobin value filter should show 1 and 100 in range fields when opened
And the saved working list view is cleaned up

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

