Feature: User interacts with tei working lists

# Scenario: User opens the default working list for a tracker program
# Given you open the main page with Ngelehun and child programme context
# Then the default working list should be displayed
# And rows per page should be set to 15
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show only teis with completed enrollments using the predefined working list
# Given you open the main page with Ngelehun and child programme context
# When you select the working list called completed enrollments
# Then the enrollment status filter button should show that the completed filter is in effect
# And the list should display teis with a completed enrollment
# And rows per page should be set to 15
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show only teis with completed enrollments using the filter
# Given you open the main page with Ngelehun and child programme context
# When you set the enrollment status filter to completed
# And you apply the current filter
# Then the enrollment status filter button should show that the completed filter is in effect
# And the list should display teis with a completed enrollment
# And rows per page should be set to 15
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show only teis with active enrollments and unassinged events using the filter
# Given you open the main page with Ngelehun and child programme context
# When you set the enrollment status filter to active
# And you apply the current filter
# And you set the assginee filter to none
# And you apply the current filter
# Then the enrollment status filter button should show that the active filter is in effect
# And the assignee filter button should show that unassigned filter is in effect
# And the list should display teis with an active enrollment and unassinged events
# And rows per page should be set to 15
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show only teis with first name containig John using the filter
# Given you open the main page with Ngelehun and child programme context
# When you set the first name filter to John
# And you apply the current filter
# Then the first name filter button should show that the filter is in effect
# And the list should display teis with John as the first name
# And rows per page should be set to 15
# And for a tracker program the page navigation should show that you are on the first page

Scenario: Show the registering unit column
Given you open the main page with Ngelehun and child programme context
When you open the column selector
And you select the registering unit and save from the column selector
Then the registering unit should display in the list

# Scenario: Show next page
# Given you open the main page with Ngelehun and child programme context
# When you click the next page button
# Then the list should display data for the second page
# And the pagination for the tei working list should show the second page

# Scenario: Show next page then previous page
# Given you open the main page with Ngelehun and child programme context
# When you click the next page button
# Then the list should display data for the second page
# And the pagination for the tei working list should show the second page
# When you click the previous page button
# Then the default working list should be displayed
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show next page then first page
# Given you open the main page with Ngelehun and child programme context
# When you click the next page button
# Then the list should display data for the second page
# And the pagination for the tei working list should show the second page
# When you click the first page button
# Then the default working list should be displayed
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show 10 rows per page
# Given you open the main page with Ngelehun and child programme context
# When you change rows per page to 10
# Then the list should display 10 rows of data
# And for a tracker program the page navigation should show that you are on the first page

# Scenario: Show teis ordered ascendingly by first name 
# Given you open the main page with Ngelehun and child programme context
# When you click the first name column header
# Then the sort arrow should indicate ascending order
# And the list should display data ordered ascendingly by first name
# And for a tracker program the page navigation should show that you are on the first page

Scenario: The TEI custom working lists is loaded
Given you open the main page with Ngelehun and malaria focus investigation program context
Then you see the custom TEI working lists
And you can load the view with the name Events assigned to me

Scenario: The user creates, updates and deletes a TEI custom working list
Given you open the main page with Ngelehun and child programme context
And you set the enrollment status filter to completed
And you apply the current filter
And you set the enrollment date to a relative range
And you apply the current filter
When you save the list with the name My custom list
Then the new custom TEI working list is created
And the enrollment status filter button should show that the completed filter is in effect
When you set the enrollment status filter to active
And you apply the current filter
When you update the list with the name My custom list
Then the enrollment status filter button should show that the active filter is in effect
And you delete the name My custom list
Then the custom TEI is deleted


# Scenario: The TEI custom working can be shared
# Given you open the main page with Ngelehun and malaria focus investigation program context
# And you see the custom TEI working lists
# And you can load the view with the name Events assigned to me
# When you change the sharing settings
# Then you see the new sharing settings

# Scenario: The admin user can optin to use the new Enrollment Dashboard
# Given you open the main page with Ngelehun and child programme context
# And you see the opt in component for Child Programme
# When you opt in to use the new enrollment Dashboard for Child Programme
# Then you see the opt out component for Child Programme
# When you opt out to use the new enrollment Dashboard for Child Programme
# Then you see the opt in component for Child Programme

Scenario: The user can delete a working list right imediatly after creating it.
Given you open the main page with Ngelehun and child programme context
And you set the enrollment status filter to completed
And you apply the current filter
And you set the enrollment date to a relative range
And you apply the current filter
When you save the list with the name My custom list
Then the new custom TEI working list is created
When you delete the name My custom list
Then the custom TEI is deleted

@v>=39
Scenario: The user can open and select a program stage filter
Given you open the main page with Ngelehun and WHO RMNCH Tracker context
When you open the program stage filters from the more filters dropdown menu
When you select the First antenatal care visit program stage
And you apply the current filter
And you open the column selector
And you select a data element columns and save from the column selector
Then you see data elements specific filters and columns