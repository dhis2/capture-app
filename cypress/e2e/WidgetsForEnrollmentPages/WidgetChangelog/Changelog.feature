Feature: The user interacts with the changelog widget

@v>=41
  Scenario: The user can view an event changelog on the enrollment edit event
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    When you select view changelog in the event overflow button
    Then the changelog modal should be visible
    And the changelog modal should contain data
    # One row is filtered out as the metadata is no longer there
    And the number of changelog table rows should be 9

  @v>=41
  Scenario: The user can change changelog page size
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    When you select view changelog in the event overflow button
    And you change the page size to 20
    # One row is filtered out as the metadata is no longer there
    Then the number of changelog table rows should be 19
    And you change the page size to 100
    Then the number of changelog table rows should be 37
    Then the table footer should display page 1

  @v>=41
  Scenario: The user can move to the next page in the changelog
    Given you land on the enrollment edit event page by having typed /#/enrollmentEventEdit?eventId=QsAhMiZtnl2&orgUnitId=DiszpKrYNg8
    When you select view changelog in the event overflow button
    And you move to the next page
    Then the table footer should display page 2