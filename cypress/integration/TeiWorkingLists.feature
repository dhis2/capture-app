Feature: User interacts with tei working lists

Scenario: User opens the default working list for a tracker program
Given you open the main page with Ngelehun and child programme context
Then teis should be retrieved from the api using the default query args
And the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show only teis with active enrollments using the predefined working list
Given you open the main page with Ngelehun and child programme context
When you select the working list called Active enrollments
Then the enrollment status filter button should show that the active filter is in effect
And teis with an active enrollment should be retrieved from the api
And the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show only teis with active enrollments using the filter
Given you open the main page with Ngelehun and child programme context
When you set the enrollment status filter to active
And you apply the enrollment status filter
Then the enrollment status filter button should show that the active filter is in effect
And teis with an active enrollment should be retrieved from the api
And the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show only teis with active enrollments and unassinged events using the filter
Given you open the main page with Ngelehun and child programme context
When you set the enrollment status filter to active
And you apply the enrollment status filter
And you set the assginee filter to none
And you apply the assignee filter
Then the enrollment status filter button should show that the active filter is in effect
And the assignee filter button should show that unassigned filter is in effect
And teis with active enrollments and unassigned events should be retrieved from the api
And the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show only teis with first name containig John using the filter
Given you open the main page with Ngelehun and child programme context
When you set the first name filter to John
And you apply the current filter
Then the first name filter button should show that the filter is in effect
And teis with a first name containing John should be retrieved from the api
And the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show the registering unit column
Given you open the main page with Ngelehun and child programme context
When you open the column selector
And you select the registering unit and save from the column selector
Then the registering unit should display in the list

Scenario: Show next page
Given you open the main page with Ngelehun and child programme context
When you click the next page buttton
Then new teis should be retrieved from the api
Then the list should display the teis retrieved from the api
And the list should show the second page

Scenario: Show next page then previous page
Given you open the main page with Ngelehun and child programme context
When you click the next page buttton
Then new teis should be retrieved from the api
Then the list should display the teis retrieved from the api
And the list should show the second page
When you click the previous page button
Then new teis should be retrieved from the api
Then the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show next page then first page
Given you open the main page with Ngelehun and child programme context
When you click the next page buttton
Then new teis should be retrieved from the api
Then the list should display the teis retrieved from the api
And the list should show the second page
When you click the first page button
Then new teis should be retrieved from the api
Then the list should display the teis retrieved from the api
And the list should show the first page

Scenario: Show 50 rows per page
Given you open the main page with Ngelehun and child programme context
When you change rows per page to 50
Then a tei batch capped at 50 records should be retrieved from the api
Then the list should display the teis retrieved from the api
And the list should show the first page
