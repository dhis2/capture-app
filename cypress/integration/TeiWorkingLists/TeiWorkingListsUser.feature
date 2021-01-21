Feature: User interacts with tei working lists

Scenario: User opens the default working list for a tracker program
Given you open the main page with Ngelehun and child programme context
Then the default working list should be displayed
And rows per page should be set to 15
And the page navigation should show that you are on the first page

Scenario: Show only teis with completed enrollments using the predefined working list
Given you open the main page with Ngelehun and child programme context
When you select the working list called completed enrollments
Then the enrollment status filter button should show that the completed filter is in effect
And the list should display teis with a completed enrollment
And rows per page should be set to 15
And the page navigation should show that you are on the first page

Scenario: Show only teis with active enrollments using the filter
Given you open the main page with Ngelehun and child programme context
When you set the enrollment status filter to completed
And you apply the current filter
Then the enrollment status filter button should show that the completed filter is in effect
And the list should display teis with a completed enrollment
And rows per page should be set to 15
And the page navigation should show that you are on the first page

Scenario: Show only teis with active enrollments and unassinged events using the filter
Given you open the main page with Ngelehun and child programme context
When you set the enrollment status filter to active
And you apply the current filter
And you set the assginee filter to none
And you apply the current filter
Then the enrollment status filter button should show that the active filter is in effect
And the assignee filter button should show that unassigned filter is in effect
And the list should display teis with a completed enrollment and unassinged events
And rows per page should be set to 15
And the page navigation should show that you are on the first page

Scenario: Show only teis with first name containig John using the filter
Given you open the main page with Ngelehun and child programme context
When you set the first name filter to John
And you apply the current filter
Then the first name filter button should show that the filter is in effect
And the list should display teis with John as the first name
And rows per page should be set to 15
And the page navigation should show that you are on the first page

Scenario: Show the registering unit column
Given you open the main page with Ngelehun and child programme context
When you open the column selector
And you select the registering unit and save from the column selector
Then the registering unit should display in the list

Scenario: Show next page
Given you open the main page with Ngelehun and child programme context
When you click the next page buttton
Then the list should display data for the second page
And the page navigation should show that you are on the second page

Scenario: Show next page then previous page
Given you open the main page with Ngelehun and child programme context
When you click the next page buttton
Then the list should display data for the second page
And the page navigation should show that you are on the second page
When you click the previous page button
Then the default working list should be displayed
And the page navigation should show that you are on the first page

Scenario: Show next page then first page
Given you open the main page with Ngelehun and child programme context
When you click the next page buttton
Then the list should display data for the second page
And the page navigation should show that you are on the second page
When you click the first page button
Then the default working list should be displayed
And the page navigation should show that you are on the first page

Scenario: Show 10 rows per page
Given you open the main page with Ngelehun and child programme context
When you change rows per page to 10
Then the list should display 10 rows of data
And the page navigation should show that you are on the first page

Scenario: Show teis ordered descendingly by first name 
Given you open the main page with Ngelehun and child programme context
When you click the first name column header
Then the sort arrow should indicate descending order
And the list should display data ordered descendingly by first name
And the page navigation should show that you are on the first page