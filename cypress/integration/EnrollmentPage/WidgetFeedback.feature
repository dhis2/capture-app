Feature: User interacts with the feedback widget

  Scenario: User can close the Feedback Widget
    Given you open the enrollment page
    When you click the feedback widget toggle button
    Then the feedback widget content should not be displayed

    Scenario: User can close and reopen the Feedback Widget
      Given you open the enrollment page
      When you click the feedback widget toggle button
      And you click the feedback widget toggle button
      Then the feedback widget should be displayed
