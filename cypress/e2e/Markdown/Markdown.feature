Feature: Feedback widget renders markdown content from program rules

  Scenario: Feedback widget is visible on the enrollment dashboard
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=EKlWxFF9NPb
    Then the feedback widget should be visible

  Scenario: Feedback widget list contains 4 items
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=EKlWxFF9NPb
    Then the list should contain 4 items

  Scenario Outline: Headers feedback item renders markdown correctly
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=EKlWxFF9NPb
    Then the <n> list item should contain p with text "Headers"
    And the <n> list item should contain h1 with text "Header 1"
    And the <n> list item should contain h2 with text "Header 2"
    And the <n> list item should contain h3 with text "Header 3"
    And the <n> list item should contain h4 with text "Header 4"
    And the <n> list item should contain h5 with text "Header 5"
    And the <n> list item should contain h6 with text "Header 6"

    @v>=43
    Examples:
      | n     |
      | first |

    @v<43
    Examples:
      | n      |
      | second |

  Scenario Outline: Italic heading and table feedback item renders correctly
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=EKlWxFF9NPb
    Then the <n> list item h6 should contain italic text "Feedback"
    And the <n> list item table should match:
      | Column A  | Column B  |
      | Content A | Content B |

    @v>=43
    Examples:
      | n      |
      | second |

    @v<43
    Examples:
      | n     |
      | first |

  @v>=43
  Scenario: Fourth feedback item renders score with color indicator correctly
    Given user lands on the enrollment edit event page by having typed #/enrollmentEventEdit?eventId=EKlWxFF9NPb
    Then the fourth list item left section should have h1 with text "1. Score 1"
    And the fourth list item right section color indicator should be "rgb(57, 166, 45)"
    And the fourth list item right section should have p with text "90%"
