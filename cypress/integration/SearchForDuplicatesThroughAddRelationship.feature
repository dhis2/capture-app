Feature: Search for duplicates in the process of creating a new TEInstance

  Scenario: Clicking the create user button shows modal with the list of duplicates
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have duplicates
    And you click create
    Then you can see a modal
    And you can see the first page of the results

  Scenario: Clicking the create user button shows a list with no results on the second page
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have exactly 5 duplicates
    And you click create
    Then you can see the first page of the results
    When you click the next page button
    Then you can see an empty page
    When you click the previous page button
    Then you can see the first page of the results

  Scenario: Clicking the create user button shows a list with working pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have duplicates
    And you click create
    Then you can see the first page of the results
    When you click the next page button
    Then you can see the second page of the results
    When you click the previous page button
    Then you can see the first page of the results

  Scenario: Clicking the create user button shows a list with disabled pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have less than 5 duplicates
    And you click create
    Then you can see the first page of the results
    And all pagination is disabled


  Scenario: Clicking the possible duplicates button shows a list with duplicates
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have duplicates
    And you click the show possible duplicates button
    Then you can see a modal
    And you can see the first page of the results

  Scenario: Clicking the possible duplicates button shows a list with no results on the second page
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have exactly 5 duplicates
    And you click the show possible duplicates button
    Then you can see the first page of the results
    When you click the next page button
    Then you can see an empty page
    When you click the previous page button
    Then you can see the first page of the results

  Scenario: Clicking the possible duplicates button shows a list has working pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have duplicates
    And you click the show possible duplicates button
    Then you can see the first page of the results
    When you click the next page button
    Then you can see the second page of the results
    When you click the previous page button
    Then you can see the first page of the results

  Scenario: Clicking the possible duplicates button shows a list with disabled pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to register a person relationship
    When you fill in the first name with values that have less than 5 duplicates
    And you click the show possible duplicates button
    Then you can see the first page of the results
    And all pagination is disabled
