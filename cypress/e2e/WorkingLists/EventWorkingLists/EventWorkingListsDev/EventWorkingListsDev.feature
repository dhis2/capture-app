Feature: Developer facing tests for user interaction with event working lists

Scenario: User opens the default working list for an event program
Given you open the main page with Ngelehun and malaria case context
Then events should be retrieved from the api using the default query args
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show only events assigned to anyone using the predefined working list
Given you open the main page with Ngelehun and malaria case context
When you select the working list called events assigned to anyone
Then the assigned to filter button should show that the anyone filter is in effect
And events assigned to anyone should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show only events assigned to anyone using the filter
Given you open the main page with Ngelehun and malaria case context
When you set the assignee filter to anyone
And you apply the assignee filter
Then the assigned to filter button should show that the anyone filter is in effect
And events assigned to anyone should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show only active events assigned to anyone using the filter
Given you open the main page with Ngelehun and malaria case context
When you set the assignee filter to anyone
And you apply the assignee filter
And you set the status filter to active
And you apply the status filter
Then the assigned to filter button should show that the anyone filter is in effect
And the status filter button should show that the active filter is in effect 
And active events that are assigned to anyone should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show only events where age is between 10 and 20 using the filter
Given you open the main page with Ngelehun and malaria case context
When you set the age filter to 10-20
And you apply the current filter on the event working list
Then the age filter button should show that the filter is in effect
And events where age is between 10 and 20 should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show next page
Given you open the main page with Ngelehun and malaria case context
When you click the next page button on the event working list
Then new events should be retrieved from the api
And the list should display the events retrieved from the api
And the pagination for the event working list should show the second page

Scenario: Show next page then previous page
Given you open the main page with Ngelehun and malaria case context
When you click the next page button on the event working list
Then new events should be retrieved from the api
And the list should display the events retrieved from the api
And the pagination for the event working list should show the second page
When you click the previous page button on the event working list
Then new events should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show next page then first page
Given you open the main page with Ngelehun and malaria case context
When you click the next page button on the event working list
Then new events should be retrieved from the api
And the list should display the events retrieved from the api
And the pagination for the event working list should show the second page
When you click the first page button on the event working list
Then new events should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show 50 rows per page
Given you open the main page with Ngelehun and malaria case context
When you change rows per page to 50
Then an event batch capped at 50 records should be retrieved from the api
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page

Scenario: Show events ordered ascendingly by report date 
Given you open the main page with Ngelehun and malaria case context
When you click the report date column header
Then the sort arrow should indicate ascending order
And events should be retrieved from the api ordered ascendingly by report date
And the list should display the events retrieved from the api
And for an event program the page navigation should show that you are on the first page