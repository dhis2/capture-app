Feature: User interacts with the view and edit functionality of the event details page

  # Interacting with category combination programs
  Scenario: User views the event details page
    Given you land on the view event page with event id: pFm7eAXCthw
    Then the event details page displays the category combination

  @with-event-coc-clean-up
  Scenario: User edits the category combination
    Given you land on the view event page with event id: pFm7eAXCthw
    And you enable edit mode
    When you change the category combination and save
    And you land on the view event page with event id: pFm7eAXCthw
    Then the event details page displays the updated category combination


