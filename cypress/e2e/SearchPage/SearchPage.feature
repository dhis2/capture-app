Feature: User interacts with Search page

    Scenario: Default view of search page without any selections
        Given you are on the default search page
        Then there should be no search domain preselected

    Scenario: Selecting manually a search domain. User lands on the page without search domain preselected and selects Person domain
        Given you are on the default search page
        When you select the search domain Person
        Then there should be Person domain forms available to search with

    Scenario: Search domain is preselected. User lands on the search page with search domain Child Programme preselected
        Given you are in the search page with the Child Programme being preselected from the url
        Then there should be visible a title with Child Program
        And there should be Child Programme domain forms visible to search with

    Scenario: Searching using unique identifier returns no results
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you fill in the unique identifier field with values that will not return a tracked entity instance
        And you click find
        Then there should be a modal popping up
        And you can close the modal

    Scenario: Searching using unique identifier returns results
        Given you are on the default search page
        When you select the search domain WHO RMNCH Tracker
        And you fill in the unique identifier field with values that will return a tracked entity instance
        And you click find
        Then you are navigated to the enrollment dashboard page

    Scenario: Searching using attributes in Tracker Program returns no results
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And you fill in the first name with values that will return no results
        And you click search
        Then you should see no results found

    Scenario: Searching using attributes in Tracker Program is invalid because no terms typed
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And you dont fill in any of the values
        And you click search
        Then there should be a validation error message

    Scenario: Searching using attributes in Tracker Program is invalid because terms typed contain nothing but spaces
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And you fill the values with nothing but spaces
        And you click search
        Then there should be a validation error message

    Scenario: Searching using attributes in Tracker Program is invalid after clearing all search terms
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And you fill in the the form with values
        And you clear the values
        And you click search
        Then there should be a validation error message

    Scenario: Clicking the back button takes you to main page
        Given you are on the search page with preselected program and org unit
        When when you click the back button
        Then you should be taken to the main page with program and org unit preselected

    Scenario: Searching using attributes in Tracker Program returns results
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And you fill in the last name with values that will return results
        And you click search
        Then you can see the first page of the results

    Scenario: Searching using one valid attribute and one attribute that contains only space 
        Given you are in the search page with the Child Programme and org unit being preselected from the url
        When you expand the attributes search area
        And you fill in the first name with value and last name with empty space
        And you click search
        Then you can see the first page of the results

    Scenario: Searching using attributes in Tracker Program has a working pagination
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And you fill in the last name with values that will return results
        And you click search
        Then you can see the first page of the results
        When you click the next page button
        Then you can see the second page of the results
        When you click the previous page button
        Then you can see the first page of the results

    Scenario: Searching using attributes in Tracker Program navigates user to the dashboard view
        Given you are on the default search page
        When you select the search domain WHO RMNCH Tracker
        And you expand the attributes search area
        And you fill in the last name with values that will return results
        And you click search
        And you can see the first page of the results
        And you click the view dashboard button
        Then you are navigated to the enrollment dashboard page

    Scenario: Searching using attributes in TEType navigates user to dashboard view
        Given you are on the default search page
        When you select the search domain Person
        And you expand the attributes search area
        And you fill in the the form with first name value: Cla
        And you click search
        And you can see the first page of the results
        And you click the view dashboard button
        Then you are navigated to the enrollment dashboard page without enrollment

    Scenario: Searching using attributes in Tracker Program domain has disabled pagination
        Given you are on the default search page
        When you select the search domain Malaria Case diagnosis
        And you expand the attributes search area
        And for Malaria case you fill in values that will return less than 5 results
        And you click search
        Then you can see the first page of the results
        And the next page button is disabled

    Scenario: Changing the program from the ScopeSelector will change the search scope
        Given you are on the default search page
        When you select Child Programme
        And you remove the Child Programme selection
        And you select the search domain Malaria Case diagnosis
        Then there should be visible a title with Malaria case diagnosis

    # Tracked entity type
    Scenario: Searching using attributes in TEType domain is invalid after clearing all search terms
        Given you are on the default search page
        When you select the search domain Person
        And you expand the attributes search area
        And you fill in the the form with values
        And you clear the values
        And you click search
        Then there should be a validation error message

    Scenario: Searching using attributes in TEType domain is invalid because terms typed contain nothing but spaces
        Given you are on the default search page
        When you select the search domain Person
        And you expand the attributes search area
        And you fill the values with nothing but spaces
        And you click search
        Then there should be a validation error message

    Scenario: Searching using attributes in TEType domain has a working pagination
        Given you are on the default search page
        When you select the search domain Person
        And you expand the attributes search area
        And you fill in the last name with values that will return results
        And you click search
        Then you can see the first page of the results
        When you click the next page button
        Then you can see the second page of the results
        When you click the previous page button
        Then you can see the first page of the results

    Scenario: Pressing enter should trigger search unique identifier returns results
        Given you are on the default search page
        When you select the search domain WHO RMNCH Tracker
        And you press enter after filling in the unique identifier field with values that will return a tracked entity instance
        Then you are navigated to the enrollment dashboard page

    Scenario: Pressing enter should trigger search attributes returns results
        Given you are in the search page with the Child Programme being preselected from the url
        And you expand the attributes search area
        When you press enter after filling in the first and last name with values that will return results
        And you can see the first page of the results

    Scenario: Searching using attributes in TEType domain has disabled pagination
        Given you are on the default search page
        When you select the search domain Person
        And you expand the attributes search area
        And for Person you fill in values that will return less than 5 results
        And you click search
        Then you can see the first page of the results
        And the next page button is disabled

    Scenario: Searching using only date range values as attributes
        Given you are in the search page with the Adult Woman being preselected from the url
        When you fill in the date of birth
        And you click search
        Then you can see the first page of the results

    Scenario: Searching using zip code range values as attributes
        Given you are in the search page with the TB program being preselected from the url
        When you expand the attributes search area
        And you fill in the zip code range numbers
        And you click search
        Then you can see the first page of the results

    Scenario: Searching using zip code range and name values as attributes
        Given you are in the search page with the TB program being preselected from the url
        When you expand the attributes search area
        And you fill in the zip code range numbers
        And you fill in the first name
        And you click search
        Then you can see the first page of the results

    Scenario: Fallback search with results
        Given you are in the search page with the Child Programme being preselected from the url
        And you expand the attributes search area
        When you fill in the first and last name with values that will return results
        And you click search
        And you can see the first page of the results
        When you click the fallback search button
        Then you stay in the same page with results from all programs being displayed

    Scenario: Fallback search navigates back to main page
        Given you are in the search page with the Child Programme and org unit being preselected from the url
        And you expand the attributes search area
        When you fill in the first and last name with values that will return results
        And you click search
        And you click the fallback search button
        When you click the back button
        Then you should be taken to the main page with org unit and program preselected

    @with-indexBD-clean
    Scenario: BulkDataEntry widget is displayed in the search page
        Given you are in the search page with the Child Programme and org unit being preselected from the url
        And the BulkDataEntry widget in idle mode is displayed
        When the user selects the "Routine visit" BulkDataEntry
        When the user navigates to "Search" using the breadcrumb
        And the BulkDataEntry widget in active mode is displayed