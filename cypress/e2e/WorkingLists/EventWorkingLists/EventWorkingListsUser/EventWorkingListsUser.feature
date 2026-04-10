Feature: User interacts with event working lists


@v>=42
Scenario: Save and load view with isEmpty filters for BOOLEAN, INTEGER, NUMBER, INTEGER_POSITIVE, DATE, ORGANISATION_UNIT, COORDINATE, FILE_RESOURCE
  Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
  When you set the isEmpty filter "Pregnant" to Is empty
  And you set the isEmpty filter "Age (years)" to Is empty
  And you set the isEmpty filter "Height in cm" to Is empty
  And you set the isEmpty filter "Weight in kg" to Is empty
  And you set the isEmpty filter "Date of admission" to Is empty
  And you set the isEmpty filter "Place of Infection" to Is empty
  And you set the isEmpty filter "Household location" to Is empty
  And you set the isEmpty filter "Documentation" to Is empty
  Then the isEmpty filter "Pregnant" should be in effect with value Is empty
  And the isEmpty filter "Age (years)" should be in effect with value Is empty
  And the isEmpty filter "Height in cm" should be in effect with value Is empty
  And the isEmpty filter "Weight in kg" should be in effect with value Is empty
  And the isEmpty filter "Date of admission" should be in effect with value Is empty
  And the isEmpty filter "Place of Infection" should be in effect with value Is empty
  And the isEmpty filter "Household location" should be in effect with value Is empty
  And the isEmpty filter "Documentation" should be in effect with value Is empty
  And you save the view as eventStoredWorkingList
  And you refresh the page
  And you open the saved view eventStoredWorkingList
  Then the isEmpty filter "Pregnant" should be in effect and show Is empty when opened
  And the isEmpty filter "Age (years)" should be in effect and show Is empty when opened
  And the isEmpty filter "Height in cm" should be in effect and show Is empty when opened
  And the isEmpty filter "Weight in kg" should be in effect and show Is empty when opened
  And the isEmpty filter "Date of admission" should be in effect and show Is empty when opened
  And the isEmpty filter "Place of Infection" should be in effect and show Is empty when opened
  And the isEmpty filter "Household location" should be in effect and show Is empty when opened
  And the isEmpty filter "Documentation" should be in effect and show Is empty when opened
  When you set the isEmpty filter "Pregnant" to Is not empty
  And you set the isEmpty filter "Age (years)" to Is not empty
  And you set the isEmpty filter "Height in cm" to Is not empty
  And you set the isEmpty filter "Weight in kg" to Is not empty
  And you set the isEmpty filter "Date of admission" to Is not empty
  And you set the isEmpty filter "Place of Infection" to Is not empty
  And you set the isEmpty filter "Household location" to Is not empty
  And you set the isEmpty filter "Documentation" to Is not empty
  And you update the view with the name eventStoredWorkingList
  And you refresh the page
  And you open the saved view eventStoredWorkingList
  Then the isEmpty filter "Pregnant" should be in effect and show Is not empty when opened
  And the isEmpty filter "Age (years)" should be in effect and show Is not empty when opened
  And the isEmpty filter "Height in cm" should be in effect and show Is not empty when opened
  And the isEmpty filter "Weight in kg" should be in effect and show Is not empty when opened
  And the isEmpty filter "Date of admission" should be in effect and show Is not empty when opened
  And the isEmpty filter "Place of Infection" should be in effect and show Is not empty when opened
  And the isEmpty filter "Household location" should be in effect and show Is not empty when opened
  And the isEmpty filter "Documentation" should be in effect and show Is not empty when opened
  And the saved working list view is cleaned up

@v<42
Scenario: Save and load view with stored WL filters - BOOLEAN, INTEGER, NUMBER, INTEGER_POSITIVE, DATE, ORGANISATION_UNIT (no empty-only types)
  Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
  When you set the boolean filter
  And you set the range filter "Age (years)" to 0-120
  And you set the range filter "Height in cm" to 100-200
  And you set the range filter "Weight in kg" to 1-200
  And you set the date filter
  And you set the organisation unit filter
  And you save the view as eventStoredWorkingList
  And you refresh the page
  And you open the saved view eventStoredWorkingList
  Then the boolean filter should be in effect and show the correct value when opened
  And the range filter "Age (years)" should be in effect and show 0 to 120 when opened
  And the range filter "Height in cm" should be in effect and show 100 to 200 when opened
  And the range filter "Weight in kg" should be in effect and show 1 to 200 when opened
  And the date filter should be in effect and show the correct value when opened
  And the organisation unit filter should be in effect and show the correct value when opened
  And the saved working list view is cleaned up

@v<42
Scenario: EMPTY_ONLY filter types (COORDINATE, FILE_RESOURCE, IMAGE, URL) are not visible in filter list - Event
  Given you open the main page with Ngelehun and Inpatient morbidity and mortality context
  When you open the More filters menu on the event working list
  Then the filter option "Household location" should not appear in the More filters menu
  And the filter option "Documentation" should not appear in the More filters menu

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
And you save the view as eventStoredWorkingList
When you delete the name eventStoredWorkingList
Then the custom events working list is deleted
