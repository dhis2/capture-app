Feature: User interacts with event working lists

Scenario: Save and load a view with a date filter
Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
When you set the date of admission filter
And you save the view as dateFilterWorkingList
And you refresh the page
And you open the dateFilterWorkingList
Then the admission filter should be in effect
