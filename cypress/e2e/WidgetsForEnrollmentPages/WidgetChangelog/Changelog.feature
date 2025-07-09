Feature: The user interacts with the changelog widget

  Background:
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    And you select view changelog in the event overflow button
    Then the changelog modal should contain data
  @v>=41
  Scenario: The user can view an event changelog on the enrollment edit event
    Then the number of changelog table rows should be 9

  @v>=41
  Scenario: The user can change the changelog page size
    When you change the page size to 20
    Then the number of changelog table rows should be 19
    And you change the page size to 100
    Then the number of changelog table rows should be 37
    And the table footer should display page 1

  @v>=41
  Scenario: The user can navigate between pages in the changelog
    When you move to the next page
    Then the table footer should display page 2
    When you move to the previous page
    Then the table footer should display page 1

  @v>=42
  Scenario: The user can filter the changelog by data item
    When you select "Treatment card" from the data item filter flyout menu
    Then the filter pill should be visible with label "Treatment card"
    And only rows with Data item "Treatment card" should be displayed

  @v>=42
  Scenario: Only one filter can be applied at a time
    When you select "HIV testing done" from the data item filter flyout menu
    Then the filter pill should be visible with label "HIV testing done"
    When you select "Disease Classification" from the data item filter flyout menu
    Then the filter pill should be visible with label "Disease Classification"
    And only rows with Data item "Disease Classification" should be displayed

  @v>=42
  Scenario: The filter remains active when sorting is applied
    When you select "Disease Classification" from the data item filter flyout menu
    When you click the sort Date icon
    Then only rows with Data item "Disease Classification" should be displayed
    And the changelog data is sorted on Date in ascending order

  @v>=42
  Scenario: The user can remove the applied filter
    When you select "Disease Classification" from the data item filter flyout menu
    Then the filter pill should be visible with label "Disease Classification"
    And only rows with Data item "Disease Classification" should be displayed
    When you remove the filter
    Then the filter pill should be visible with label "Show all"

  @skip # Flaky test, fix in DHIS2-19814
  Scenario: The user can sort by Date
    When you click the sort Date icon
    Then the changelog modal should contain data
    And the changelog data is sorted on Date in ascending order

  @v>=42
  Scenario: The user can sort by User
    When you click the sort User icon
    Then the changelog modal should contain data
    And the changelog data is sorted on User in ascending order

  @v>=42
  Scenario: The user can sort by Data item
    When you click the sort Data item icon
    Then the changelog modal should contain data
    And the changelog data is sorted on Data item in ascending order
