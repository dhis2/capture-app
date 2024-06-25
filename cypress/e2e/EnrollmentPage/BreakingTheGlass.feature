Feature: Breaking the glass page

  # TECH-1662 - Flaky test
  @skip
  Scenario: User with search scope access tries to access an enrollment in a protected program
    Given the tei created by this test is cleared from the database
    And the data store is clean
    And you create a new tei in Child programme from Ngelehun CHC
    And you change program to WHO RMNCH Tracker
    And you enroll the tei from Njandama MCHP
    And you log out
    And you log in as tracker2 user
    And you select the new tei
    And you change program to WHO RMNCH Tracker
    Then you see the breaking the glass page
    When you type a reason
    And you click Check for enrollments
    Then you see the enrollment in WHO RMNCH Tracker
