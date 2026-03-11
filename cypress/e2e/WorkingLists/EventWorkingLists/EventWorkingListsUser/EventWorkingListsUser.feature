Feature: User interacts with event working lists

Scenario: Save and load a view with date, integer and coordinate filters
Given you open the main page with Ngelehun and malaria case context
When you set the report date filter
And you set the Organisation unit filter to Ngelehun
And you set the age filter to 20-30
And you apply the current filter
And you set the Household location filter to Is empty
And you apply the current filter
And you save the view as dateFilterWorkingList
And you refresh the page
And you open the dateFilterWorkingList
Then the list should display one record with report date matching filter
Then the report date filter should be in effect
And the Organisation unit filter should be in effect
And the age filter button should show 20 to 30 in effect
And the Household location filter button should show that the filter is in effect
And the Household location filter should show Is empty checked
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
