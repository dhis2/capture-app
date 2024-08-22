Feature: User interacts with tei working lists

  Scenario: The TEI custom working can be shared
    Given you open the main page with Ngelehun and Malaria focus investigation context
    And you see the custom TEI working lists
    And you can load the view with the name Events assigned to me
    And you create a copy of the working list
    When you change the sharing settings
    Then you see the new sharing settings

Scenario: User opens the default working list for a tracker program
Given you open the main page with Ngelehun and child programe context
Then the default working list should be displayed
And rows per page should be set to 15
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with completed enrollments using the predefined working list
Given you open the main page with Ngelehun and child programe context
When you select the working list called completed enrollments
Then the enrollment status filter button should show that the completed filter is in effect
And the list should display teis with a completed enrollment
And rows per page should be set to 15
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with completed enrollments using the filter
Given you open the main page with Ngelehun and child programe context
When you set the enrollment status filter to completed
And you apply the current filter
Then the enrollment status filter button should show that the completed filter is in effect
And the list should display teis with a completed enrollment
And rows per page should be set to 15
And for a tracker program the page navigation should show that you are on the first page

# DHIS2-13960: /trackedEntities filter by assignee results are not consistent
@skip
Scenario: Show only teis with active enrollments and unassinged events using the filter
Given you open the main page with Ngelehun and Malaria focus investigation context
When you set the enrollment status filter to active
And you apply the current filter
And you set the assginee filter to none
And you apply the current filter
Then the enrollment status filter button should show that the active filter is in effect
And the assignee filter button should show that unassigned filter is in effect
And the list should display teis with an active enrollment and unassinged events
And rows per page should be set to 15
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show only teis with first name containig John using the filter
Given you open the main page with Ngelehun and child programe context
When you set the first name filter to John
And you apply the current filter
Then the first name filter button should show that the filter is in effect
And the list should display teis with John as the first name
And rows per page should be set to 15
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show the registering unit column
Given you open the main page with Ngelehun and child programe context
When you open the column selector
And you select the organisation unit and save from the column selector
Then the organisation unit should display in the list

Scenario: Show next page
Given you open the main page with Ngelehun and child programe context
When you click the next page button
Then the list should display data for the second page
And the pagination for the tei working list should show the second page

Scenario: Show next page then previous page
Given you open the main page with Ngelehun and child programe context
When you click the next page button
Then the list should display data for the second page
And the pagination for the tei working list should show the second page
When you click the previous page button
Then the default working list should be displayed
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show next page then first page
Given you open the main page with Ngelehun and child programe context
When you click the next page button
Then the list should display data for the second page
And the pagination for the tei working list should show the second page
When you click the first page button
Then the default working list should be displayed
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show 10 rows per page
Given you open the main page with Ngelehun and child programe context
When you change rows per page to 10
Then the list should display 10 rows of data
And for a tracker program the page navigation should show that you are on the first page

Scenario: Show teis ordered ascendingly by first name
Given you open the main page with Ngelehun and child programe context
When you click the first name column header
Then the sort arrow should indicate ascending order
And the list should display data ordered ascendingly by first name
And for a tracker program the page navigation should show that you are on the first page

Scenario: The TEI custom working lists is loaded
Given you open the main page with Ngelehun and Malaria focus investigation context
Then you see the custom TEI working lists
And you can load the view with the name Events assigned to me



Scenario: The user creates, updates and deletes a TEI custom working list
Given you open the main page with Ngelehun and Malaria case diagnosis context
And you set the enrollment status filter to completed
And you apply the current filter
And you set the enrollment date to a relative range
And you apply the current filter
When you save the list with the name My custom list
Then the new My custom list is created
And the enrollment status filter button should show that the completed filter is in effect
When you set the enrollment status filter to active
And you apply the current filter
When you update the list with the name My custom list
Then the enrollment status filter button should show that the active filter is in effect
And you delete the name My custom list
Then the My custom list is deleted

Scenario: The user can delete a TEI working list right immediately after creating it.
Given you open the main page with Ngelehun and Malaria case diagnosis context
And you set the enrollment status filter to completed
And you apply the current filter
And you set the enrollment date to a relative range
And you apply the current filter
When you save the list with the name My custom list
Then the new My custom list is created
When you delete the name My custom list
Then the My custom list is deleted

Scenario: The user can open and select a program stage filter
Given you open the main page with Ngelehun and Malaria focus investigation context
When you open the program stage filters from the more filters dropdown menu
When you select the Foci response program stage
And you apply the current filter
And you open the column selector
And you select a data element columns and save from the column selector
Then you see data elements specific filters and columns

Scenario: While in a program stage working list, the user can filter by both TEA and data elements
Given you open the main page with Ngelehun, WHO RMNCH Tracker and First antenatal care visit context
When you set the enrollment status filter to active
And you apply the current filter
And you set the event status filter to completed
And you apply the current filter
And you set the first name filter to Urzula
And you apply the current filter
And you set the WHOMCH Smoking filter to No
And you apply the current filter
Then the list should display 1 row of data

Scenario: While in a program stage working list, the user can sort by both TEA and data elements
Given you open the main page with Ngelehun, WHO RMNCH Tracker and First antenatal care visit context
And you set the first name filter to u
And you apply the current filter
When you click the last name column header
Then the sort arrow should indicate ascending order
And the list should display data ordered ascendingly by last name
When you click the WHOMCH Hemoglobin value column header
Then the sort arrow should indicate descending order
And the list should display data ordered descending by WHOMCH Hemoglobin

Scenario: The user can remove the program stage filter
Given you open the main page with Ngelehun and WHO RMNCH Tracker context
When you open the program stage filters from the more filters dropdown menu
And you select the First antenatal care visit program stage
And you apply the current filter
Then you see program stage working list events
When you remove the program stage filter
Then you don't see program stage working list events

Scenario: The user can filter the events by scheduledAt date
Given you open the main page with Ngelehun and WHO RMNCH Tracker context
When you open the program stage filters from the more filters dropdown menu
And you select the First antenatal care visit program stage
And you apply the current filter
Then you see scheduledAt filter
And you open the column selector
When you select a scheduledAt column and save from the column selector
And you select the events scheduled today
And you apply the current filter
Then you see the selected option in the scheduledAt filter

Scenario: The program stage working list configureation is kept when navigating
Given you open the main page with Ngelehun and WHO RMNCH Tracker context and configure a program stage working list
When you open an enrollment event from the working list
And you go back using the browser button
Then the program stage working list is loaded

Scenario: The program stage working list without a orgUnit selected redirects to a tracker event
Given you open the main page with all accesible records in the WHO RMNCH Tracker context and configure a program stage working list
When you open an enrollment event from the working list
Then the tracker event URL contains the orgUnitId

Scenario: The user can open a program stage list without events
Given you open the main page with Ngelehun and WHO RMNCH Tracker context and configure a program stage working list
And you set the event visit date to Today
And you apply the current filter
Then the working list is empty

@v>=40
Scenario: The user creates, updates and deletes a Program stage custom working list
Given you open the main page with Ngelehun and Malaria case diagnosis and Household investigation context
And you set the enrollment status filter to completed
And you apply the current filter
And you set the enrollment date to a relative range
And you apply the current filter
When you save the list with the name Custom Program stage list
Then the new Custom Program stage list is created
And the enrollment status filter button should show that the completed filter is in effect
When you set the enrollment status filter to active
And you apply the current filter
When you update the list with the name Custom Program stage list
Then the enrollment status filter button should show that the active filter is in effect
And you delete the name Custom Program stage list
Then the Custom Program stage list is deleted

@v>=40
Scenario: The user can delete a Program stage working list right immediately after creating it.
Given you open the main page with Ngelehun and Malaria case diagnosis and Household investigation context
When you save the list with the name Custom Program stage list
Then the new Custom Program stage list is created
And you delete the name Custom Program stage list
Then the Custom Program stage list is deleted

# For the program stage WL scenarios I need to create/delete my own because there are no program stage working lists in the demo database.
@v>=40
Scenario: The Program stage custom working can be shared
Given you open the main page with Ngelehun and Malaria case diagnosis and Household investigation context
And you save the list with the name Custom Program stage list
When you change the sharing settings
Then you see the new sharing settings

@v>=40
Scenario: The Program stage working list configuration is kept when changing the org unit
Given you open the main page with Ngelehun and Malaria case diagnosis and Household investigation context
And you save the list with the name Custom Program stage list
Then the new Custom Program stage list is created
And you set the event status filter to completed
And you apply the current filter
And you change the org unit
Then the working list configuration was kept
And you delete the name Custom Program stage list
And the Custom Program stage list is deleted

@v>=40
Scenario: The user can save a program stage working list, based on a TEI working list configuration
Given you open a clean main page with Ngelehun and Malaria focus investigation context
Then you see the custom TEI working lists
And you can load the view with the name Ongoing foci responses
And you open the program stage filters from the more filters dropdown menu
And you select the Foci response program stage
And you apply the current filter
Then you are redirect to the default templete
When you save the list with the name Custom Program stage list
Then the new Custom Program stage list is created
And the TEI working list initial configuration was kept
And you delete the name Custom Program stage list
Then the Custom Program stage list is deleted

@v>=40
Scenario: The user can download the tracked entity working list
Given you open the main page with Ngelehun and child programe context
And you open the menu and click the "Download data..." button
Then the download dialog opens
Then the CSV button exists
Then the JSON button exists

@v<40
Scenario: The user can download the tracked entity working list
Given you open the main page with Ngelehun and child programe context
And you open the menu and click the "Download data..." button
Then the download dialog opens
Then the JSON button exists

Scenario: The user cannot download the tracked entity working list when no orgUnit is selected
Given you open the main page with child programe context
And the user clicks the element containing the text: Or see all records accessible to you in Child Programme 
And you open the menu
Then the "Download data..." button is hidden

