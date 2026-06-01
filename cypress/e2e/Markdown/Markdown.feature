Feature: Feedback widget renders markdown content from program rules

  Scenario: Feedback widget is visible on the enrollment dashboard
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=hmX770XqCSS
    Then the feedback widget should be visible

  Scenario: Feedback widget list contains 4 items
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=hmX770XqCSS
    Then the list should contain 4 items

  Scenario: First feedback item renders headers markdown correctly
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=hmX770XqCSS
    Then the first list item should contain p with text "Headers"
    And the first list item should contain h1 with text "Header 1"
    And the first list item should contain h2 with text "Header 2"
    And the first list item should contain h3 with text "Header 3"
    And the first list item should contain h4 with text "Header 4"
    And the first list item should contain h5 with text "Header 5"
    And the first list item should contain h6 with text "Header 6"

  Scenario: Second feedback item renders italic heading and table correctly
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=hmX770XqCSS
    Then the second list item h6 should contain italic text "Feedback"
    And the second list item table should match:
      | Column A  | Column B  |
      | Content A | Content B |

  Scenario: Fourth feedback item renders score with color indicator correctly
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=hmX770XqCSS
    Then the fourth list item left section should have h1 with text "1. Score 1"
    And the fourth list item right section color indicator should be "rgb(238, 71, 71)"
    And the fourth list item right section should have p with text "66.67%"
