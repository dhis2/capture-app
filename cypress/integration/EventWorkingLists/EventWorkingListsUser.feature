Feature: User interacts with event working lists

Scenario: Ensure sharing settings are preserved when updating a working list
Given you open the main page with Ngelehun and malaria case context
When you select the working list called Events today
And you change the sharing settings
And you update the working list
Then your newly defined sharing settings should still be present 

Scenario: Save and load a view with a date filter
Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
When you set the date of admission filter
And you save the view as dateFilterWorkingList
And you refresh the page
And you open the dateFilterWorkingList
Then the admission filter should be in effect
