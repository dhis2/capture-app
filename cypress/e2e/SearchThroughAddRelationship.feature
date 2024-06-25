Feature: User searches for existing TEInstance in the context of adding a relationship

  # Search domain Tracker Program

  Scenario: Searching using attributes in Tracker Program returns no results
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the first name with values that will return no results
    And you click search
    Then you can see an empty page
    And all pagination is disabled

  Scenario: Searching using attributes in Tracker Program returns results
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the first name with values that will return results
    And you click search
    Then you can see the first page of the results

  Scenario: Searching using attributes in Tracker Program is invalid because no terms typed
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you click search
    Then there should be a validation error message

  Scenario: Searching using attributes in Tracker Program throws error
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the first name with values that will return an error
    And you click search
    Then you can see an empty page
#    todo in this case pagination is broken
#    Then all pagination is disabled

  Scenario: Searching using attributes in Tracker Program has a working pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the first name with values that will return results
    And you click search
    Then you can see the first page of the results
    When you click the next page button
    Then you can see the second page of the results
    When you click the previous page button
    Then you can see the first page of the results

  Scenario: Searching using attributes in Tracker Program domain has disabled pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the the form with values that will return less than 5 results
    And you click search
    Then you can see an empty page
    And all pagination is disabled

  Scenario: Searching using ip code range values as attributes
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the zip code range numbers
    And you click search
    Then you can see the first page of the results

  Scenario: Searching using attributes in Tracker Program shows no results on the second page
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you select search scope TB program
    And you expand the fifth search area
    When you fill in the the form with values that will return exactly 5 results
    And you click search
    Then you can see the first page of the results
    When you click the next page button
    Then you can see an empty page
    When you click the previous page button
    When you can see the first page of the results


  #  Search domain Tracked Entity Type

  Scenario: Searching using attributes in TEType domain returns no results
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    When you fill in the first name with values that will return no results
    And you click search
    Then you can see an empty page
    And all pagination is disabled

  Scenario: Searching using attributes in TEType domain returns results
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    And you fill in the first name with values that will return results
    When you click search
    Then you can see the first page of the results

  Scenario: Searching using attributes in TEType domain is invalid because no terms typed
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    When you click search
    Then there should be a validation error message


  Scenario: Searching using attributes in TEType domain throws error
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    When you fill in the first name with values that will return an error
    And you click search
    Then you can see an empty page
#    todo in this case pagination is broken
#    Then all pagination is disabled

  Scenario: Searching using attributes in TEType domain has a working pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    When you fill in the first name with values that will return results
    And you click search
    Then you can see the first page of the results
    When you click the next page button
    Then you can see the second page of the results
    When you click the previous page button
    Then you can see the first page of the results

  Scenario: Searching using attributes in TEType domain has disabled pagination
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    When you fill in the the form with values that will return less than 5 results
    And you click search
    Then you can see the first page of the results
    And all pagination is disabled

  Scenario: Searching using attributes in TEType domain shows no results on the second page
    Given you open the the new event page in Ngelehun and malaria case context
    And you navigate to find a person relationship
    And you expand the third search area
    When you fill in the the form with values that will return exactly 5 results
    And you click search
    Then you can see the first page of the results
    When you click the next page button
    Then you can see an empty page
    When you click the previous page button
    When you can see the first page of the results



#  todo scenarios which are not working
#  Scenario: Searching using attributes in Tracker Program is invalid after clearing all search terms
#    Given you open the the new event page in Ngelehun and malaria case context
#    And you navigate to find a person relationship
#    And you select search scope TB program
#    When you expand the fifth search area
#    And you fill in the the form with values
#    And you clear the values
#    And you click search
#    Then there should be a validation error message

#  Scenario: Searching using attributes in Tracker Program is invalid because terms typed contain nothing but spaces
#    Given you open the the new event page in Ngelehun and malaria case context
#    And you navigate to find a person relationship
#    And you select search scope TB program
#    When you expand the fifth search area
#    And you fill the values with nothing but spaces
#    And you click search
#    Then there should be a validation error message


#  Scenario: Searching using attributes in TET domain is invalid after clearing all search terms
#    Given you open the the new event page in Ngelehun and malaria case context
#    And you navigate to find a person relationship
#    When you expand the fifth search area
#    And you fill in the the form with values
#    And you clear the values
#    And you click search
#    Then there should be a validation error message

#  Scenario: Searching using attributes in TEType domain is invalid because terms typed contain nothing but spaces
#    Given you open the the new event page in Ngelehun and malaria case context
#    And you navigate to find a person relationship
#    When you expand the third search area
#    And you fill the values with nothing but spaces
#    And you click search
#    Then there should be a validation error message