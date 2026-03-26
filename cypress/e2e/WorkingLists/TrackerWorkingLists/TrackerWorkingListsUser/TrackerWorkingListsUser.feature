Feature: User interacts with tei working lists


  Scenario: Save and load view with stored WL filters - EMAIL
    Given you open the main page with Ngelehun and WHO RMNCH Tracker context
    When you set the text filter "Email address" to inverse@example.org
    Then the text filter "Email address" should be in effect with value inverse@example.org
    And you save the view as trackerStoredWorkingList
    And you refresh the page
    When you set the text filter "Email address" to test@example.com
    And you update the tracker tei view with the name trackerStoredWorkingList
    And you refresh the page
    Then the text filter "Email address" should be in effect and show test@example.com when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with stored WL filters - FILE_RESOURCE, BOOLEAN, LONG_TEXT
    Given you open the main page with Ngelehun and child programme default template context
    When you set the isEmpty filter "Birth certificate" to Is empty
    And you set the option filter "BCG dose" to Yes
    And you set the text filter "Apgar comment" to some long text comment
    And you save the program stage view as trackerStoredWorkingList
    And you refresh the page
    Then the isEmpty filter "Birth certificate" should be in effect and show Is empty when opened
    And the option filter "BCG dose" should be in effect and show Yes when opened
    And the text filter "Apgar comment" should be in effect and show some long text comment when opened
    And the saved tracker working list view is cleaned up

  @v<42
  Scenario: Save and load view with stored WL filters - BOOLEAN, LONG_TEXT (no empty-only types)
    Given you open the main page with Ngelehun and child programme default template context
    When you set the option filter "BCG dose" to Yes
    And you set the text filter "Apgar comment" to some long text comment
    And you save the program stage view as trackerProgramStageNoEmpty
    And you refresh the page
    Then the option filter "BCG dose" should be in effect and show Yes when opened
    And the text filter "Apgar comment" should be in effect and show some long text comment when opened
    And the saved tracker working list view is cleaned up

  Scenario: Save and load view with stored WL filters - Care at birth INTEGER_POSITIVE, INTEGER_ZERO_OR_POSITIVE, INTEGER_NEGATIVE, PERCENTAGE, DATE, ORGANISATION_UNIT
    Given you open the main page with Ngelehun, WHO RMNCH Tracker and Care at birth context
    When you set the range filter "WHOMCH Fetal heart rate on admission" to 60-180
    And you set the range filter "WHOMCH Estimated blood loss (ml)" to 0-500
    And you set the range filter "WHOMCH Body temperature" to 36-40
    And you set the range filter "WHOMCH Haematocrit value" to 0-100
    And you set the range filter "WHOMCH Heart rate" to 60-120
    And you set the range filter "WHOMCH Respiratory rate" to -20--5
    And you set the date filter "WHOMCH Date of induction of labor" to 2000-01-01 and 2010-12-31
    And you set the program stage organisation unit filter "WHOMCH Hospital / Birth clinic" to "Ngelehun"
    And you save the program stage view as trackerStoredWorkingList
    And you refresh the page
    Then the range filter "WHOMCH Fetal heart rate on admission" should be in effect and show 60 to 180 when opened
    And the range filter "WHOMCH Estimated blood loss (ml)" should be in effect and show 0 to 500 when opened
    And the range filter "WHOMCH Body temperature" should be in effect and show 36 to 40 when opened
    And the range filter "WHOMCH Haematocrit value" should be in effect and show 0 to 100 when opened
    And the range filter "WHOMCH Heart rate" should be in effect and show 60 to 120 when opened
    And the range filter "WHOMCH Respiratory rate" should be in effect and show -20 to -5 when opened
    And the date filter "WHOMCH Date of induction of labor" should be in effect and show 2000-01-01 to 2010-12-31 when opened
    And the program stage organisation unit filter "WHOMCH Hospital / Birth clinic" should be in effect and show "Ngelehun" when opened
    And the saved tracker working list view is cleaned up

  Scenario: Save and load view with stored WL filters - TRUE_ONLY
    Given you open the main page with Ngelehun and Malaria case diagnosis default template context
    When you set the option filter "Date of birth (mal) is estimated" to Yes
    And you save the view as trackerStoredWorkingList
    And you refresh the page
    Then the option filter "Date of birth (mal) is estimated" should be in effect and show Yes when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with stored WL filters - TEXT, AGE, NUMBER, PHONE_NUMBER, COORDINATE
    Given you open the main page with Ngelehun and TEI value types program context
    When you set the first name filter to ValueTypesTest
    And you apply the current filter
    And you set the date filter "Age" to 1990-01-01 and 2010-12-31
    And you set the range filter "Height in cm" to 100-200
    And you set the range filter "Weight in kg" to 1-200
    And you set the text filter "Phone number" to 12345678
    And you set the isEmpty filter "Residence location" to Is empty
    And you save the view as trackerStoredWorkingList
    And you refresh the page
    Then the text filter "First name" should be in effect and show ValueTypesTest when opened
    And the date filter "Age" should be in effect and show 1990-01-01 to 2010-12-31 when opened
    And the range filter "Height in cm" should be in effect and show 100 to 200 when opened
    And the range filter "Weight in kg" should be in effect and show 1 to 200 when opened
    And the text filter "Phone number" should be in effect and show 12345678 when opened
    And the isEmpty filter "Residence location" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isEmpty filters for TEA types - TEXT, NUMBER, AGE
    Given you open the main page with Ngelehun and TEI value types program context
    When you set the isEmpty filter "Phone number" to Is not empty
    And you set the isEmpty filter "Height in cm" to Is empty
    And you set the isEmpty date filter "Age" to Is not empty
    And you save the view as trackerIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Phone number" should be in effect and show Is not empty when opened
    And the isEmpty filter "Height in cm" should be in effect and show Is empty when opened
    And the isEmpty date filter "Age" should be in effect and show Is not empty when opened
    When you set the isEmpty filter "Phone number" to Is empty
    And you set the isEmpty filter "Height in cm" to Is not empty
    And you set the isEmpty date filter "Age" to Is empty
    And you update the tracker tei view with the name trackerIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Phone number" should be in effect and show Is empty when opened
    And the isEmpty filter "Height in cm" should be in effect and show Is not empty when opened
    And the isEmpty date filter "Age" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isNotEmpty filters for TEA types - TEXT, NUMBER, AGE
    Given you open the main page with Ngelehun and TEI value types program context
    When you set the isEmpty filter "Phone number" to Is not empty
    And you set the isEmpty filter "Height in cm" to Is empty
    And you set the isEmpty date filter "Age" to Is not empty
    And you save the view as trackerIsNotEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Phone number" should be in effect and show Is not empty when opened
    And the isEmpty filter "Height in cm" should be in effect and show Is empty when opened
    And the isEmpty date filter "Age" should be in effect and show Is not empty when opened
    When you set the isEmpty filter "Phone number" to Is empty
    And you set the isEmpty filter "Height in cm" to Is not empty
    And you set the isEmpty date filter "Age" to Is empty
    And you update the tracker tei view with the name trackerIsNotEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Phone number" should be in effect and show Is empty when opened
    And the isEmpty filter "Height in cm" should be in effect and show Is not empty when opened
    And the isEmpty date filter "Age" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isEmpty filters for program stage types - BOOLEAN, LONG_TEXT
    Given you open the main page with Ngelehun and child programme default template context
    When you set the isEmpty filter "BCG dose" to Is not empty
    And you set the isEmpty filter "Apgar comment" to Is empty
    And you save the program stage view as trackerPSIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "BCG dose" should be in effect and show Is not empty when opened
    And the isEmpty filter "Apgar comment" should be in effect and show Is empty when opened
    When you set the isEmpty filter "BCG dose" to Is empty
    And you set the isEmpty filter "Apgar comment" to Is not empty
    And you update the tracker program stage view with the name trackerPSIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "BCG dose" should be in effect and show Is empty when opened
    And the isEmpty filter "Apgar comment" should be in effect and show Is not empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isEmpty filters for Care at birth program stage types - INTEGER_POSITIVE, PERCENTAGE, DATE, ORGANISATION_UNIT, INTEGER_ZERO_OR_POSITIVE, INTEGER_NEGATIVE
    Given you open the main page with Ngelehun, WHO RMNCH Tracker and Care at birth context
    When you set the isEmpty filter "WHOMCH Fetal heart rate on admission" to Is not empty
    And you set the isEmpty filter "WHOMCH Body temperature" to Is empty
    And you set the isEmpty filter "WHOMCH Estimated blood loss (ml)" to Is not empty
    And you set the isEmpty filter "WHOMCH Respiratory rate" to Is empty
    And you set the isEmpty date filter "WHOMCH Date of induction of labor" to Is not empty
    And you set the isEmpty filter "WHOMCH Hospital / Birth clinic" to Is not empty
    And you save the program stage view as trackerCareIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "WHOMCH Fetal heart rate on admission" should be in effect and show Is not empty when opened
    And the isEmpty filter "WHOMCH Body temperature" should be in effect and show Is empty when opened
    And the isEmpty filter "WHOMCH Estimated blood loss (ml)" should be in effect and show Is not empty when opened
    And the isEmpty filter "WHOMCH Respiratory rate" should be in effect and show Is empty when opened
    And the isEmpty date filter "WHOMCH Date of induction of labor" should be in effect and show Is not empty when opened
    And the isEmpty filter "WHOMCH Hospital / Birth clinic" should be in effect and show Is not empty when opened
    When you set the isEmpty filter "WHOMCH Fetal heart rate on admission" to Is empty
    And you set the isEmpty filter "WHOMCH Body temperature" to Is not empty
    And you set the isEmpty filter "WHOMCH Estimated blood loss (ml)" to Is empty
    And you set the isEmpty filter "WHOMCH Respiratory rate" to Is not empty
    And you set the isEmpty date filter "WHOMCH Date of induction of labor" to Is empty
    And you set the isEmpty filter "WHOMCH Hospital / Birth clinic" to Is empty
    And you update the tracker program stage view with the name trackerCareIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "WHOMCH Fetal heart rate on admission" should be in effect and show Is empty when opened
    And the isEmpty filter "WHOMCH Body temperature" should be in effect and show Is not empty when opened
    And the isEmpty filter "WHOMCH Estimated blood loss (ml)" should be in effect and show Is empty when opened
    And the isEmpty filter "WHOMCH Respiratory rate" should be in effect and show Is not empty when opened
    And the isEmpty date filter "WHOMCH Date of induction of labor" should be in effect and show Is empty when opened
    And the isEmpty filter "WHOMCH Hospital / Birth clinic" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isEmpty filters for TRUE_ONLY type
    Given you open the main page with Ngelehun and Malaria case diagnosis default template context
    When you set the isEmpty filter "Date of birth (mal) is estimated" to Is not empty
    And you save the view as trackerTrueOnlyIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Date of birth (mal) is estimated" should be in effect and show Is not empty when opened
    When you set the isEmpty filter "Date of birth (mal) is estimated" to Is empty
    And you update the tracker tei view with the name trackerTrueOnlyIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Date of birth (mal) is estimated" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isEmpty filters for EMAIL type
    Given you open the main page with Ngelehun and WHO RMNCH Tracker context
    When you set the isEmpty filter "Email address" to Is not empty
    And you save the view as trackerEmailIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Email address" should be in effect and show Is not empty when opened
    When you set the isEmpty filter "Email address" to Is empty
    And you update the tracker tei view with the name trackerEmailIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "Email address" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v>=42
  Scenario: Save and load view with isEmpty filters for OPTION_SET (program stage BOOLEAN with option set)
    Given you open the main page with Ngelehun, WHO RMNCH Tracker and First antenatal care visit context
    When you set the isEmpty filter "WHOMCH Smoking" to Is not empty
    And you save the program stage view as trackerOptionSetIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "WHOMCH Smoking" should be in effect and show Is not empty when opened
    When you set the isEmpty filter "WHOMCH Smoking" to Is empty
    And you update the tracker program stage view with the name trackerOptionSetIsEmptyWorkingList
    And you refresh the page
    Then the isEmpty filter "WHOMCH Smoking" should be in effect and show Is empty when opened
    And the saved tracker working list view is cleaned up

  @v<42
  Scenario: Save and load view with stored WL filters - TEXT, AGE, NUMBER, PHONE_NUMBER (no empty-only types)
    Given you open the main page with Ngelehun and TEI value types program context
    When you set the first name filter to ValueTypesTest
    And you apply the current filter
    And you set the date filter "Age" to 1990-01-01 and 2010-12-31
    And you set the range filter "Height in cm" to 100-200
    And you set the range filter "Weight in kg" to 1-200
    And you set the text filter "Phone number" to 12345678
    And you save the view as trackerValueTypesNoEmpty
    And you refresh the page
    Then the text filter "First name" should be in effect and show ValueTypesTest when opened
    And the date filter "Age" should be in effect and show 1990-01-01 to 2010-12-31 when opened
    And the range filter "Height in cm" should be in effect and show 100 to 200 when opened
    And the range filter "Weight in kg" should be in effect and show 1 to 200 when opened
    And the text filter "Phone number" should be in effect and show 12345678 when opened
    And the saved tracker working list view is cleaned up

  @v<42
  Scenario: EMPTY_ONLY filter types (COORDINATE, FILE_RESOURCE, IMAGE, URL) are not visible in filter list - Tracker
    Given you open the main page with Ngelehun and child programme default template context
    When you open the program stage More filters menu for Birth on the tracker working list
    Then the filter option "Birth certificate" should not appear in the More filters menu
    And you open the main page with Ngelehun and TEI value types program context
    When you open the More filters menu on the tracker working list
    Then the filter option "Residence location" should not appear in the More filters menu

  Scenario: The user can download the tracked entity working list
    Given you open the main page with Ngelehun and child programe context
    And you open the menu and click the "Download data..." button
    Then the download dialog opens
    Then the CSV button exists
    Then the JSON button exists

  Scenario: The user cannot download the tracked entity working list when no orgUnit is selected
    Given you open the main page with child programe context
    And the user clicks the element containing the text: Or see all records accessible to you in Child Programme
    And you open the menu
    Then the "Download data..." button is hidden

