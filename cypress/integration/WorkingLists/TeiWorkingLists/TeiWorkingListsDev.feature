Feature: Developer facing tests for user interaction with Tei working lists

Scenario: User opens the default working list for a tracker program
Given you open the main page with Ngelehun and child programme context
Then teis should be retrieved from the api using the default query args
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with active enrollments using the predefined working list
Given you open the main page with Ngelehun and child programme context
When you select the working list called Active enrollments
Then the enrollment status filter button should show that the active filter is in effect
And teis with an active enrollment should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with active enrollments using the filter
Given you open the main page with Ngelehun and child programme context
When you set the enrollment status filter to active
And you apply the enrollment status filter
Then the enrollment status filter button should show that the active filter is in effect
And teis with an active enrollment should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with active enrollments and unassinged events using the filter
Given you open the main page with Ngelehun and Malaria focus investigation context
When you set the enrollment status filter to active
And you apply the enrollment status filter
And you set the assginee filter to none
And you apply the assignee filter
Then the enrollment status filter button should show that the active filter is in effect
And the assignee filter button should show that unassigned filter is in effect
And teis with active enrollments and unassigned events should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with first name containig John using the filter
Given you open the main page with Ngelehun and child programme context
When you set the first name filter to John
And you apply the current filter on the tei working list
Then the first name filter button should show that the filter is in effect
And teis with a first name containing John should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show next page
Given you open the main page with Ngelehun and child programme context
When you click the next page button on the tei working list
Then new teis should be retrieved from the api
And the list should display the teis retrieved from the api
And the pagination for the tei working list should show the second page

Scenario: Show next page then previous page
Given you open the main page with Ngelehun and child programme context
When you click the next page button on the tei working list
Then new teis should be retrieved from the api
And the list should display the teis retrieved from the api
And the pagination for the tei working list should show the second page
When you click the previous page button on the tei working list
Then new teis should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show next page then first page
Given you open the main page with Ngelehun and child programme context
When you click the next page button on the tei working list
Then new teis should be retrieved from the api
And the list should display the teis retrieved from the api
And the pagination for the tei working list should show the second page
When you click the first page button on the tei working list
Then new teis should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show 50 rows per page
Given you open the main page with Ngelehun and child programme context
When you change rows per page to 50
Then a tei batch capped at 50 records should be retrieved from the api
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show teis ordered descendingly by first name 
Given you open the main page with Ngelehun and child programme context
When you click the first name column header
Then the sort arrow should indicate ascending order
And teis should be retrieved from the api ordered ascendingly by first name
And the list should display the teis retrieved from the api
And for a tracker program the page navigation should show that you are on the first page