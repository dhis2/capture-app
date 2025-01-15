Feature: Related stages

    Scenario: Edit event -> Link to an existing event
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?eventId=TwoGi1mUFFw&orgUnitId=lyONqUkY1Bq
        Then the Related stages Actions should be visible at the bottom of the page
        # When the user selects "Schedule a new visit"
        # And selects a different Organisational unit
        # And fills in the required event details
        # And clicks "Complete"
        # Then a new event should be created
        # And a response event should be scheduled
        # And both events should be linked

    # Scenario: Adding a new tracker event with direct data entry
    #     When the user opens the new event form
    #     And selects "Enter data directly" from the Actions widget
    #     And fills in the event data
    #     And clicks "Save"
    #     Then a new event should be created
    #     And a linked event should be created with the entered data
    #     And both events should be linked

    # Scenario: Linking to an existing event
    #     When the user opens the new event form
    #     And selects "Link to existing event" from the Actions widget
    #     And selects an existing event
    #     And clicks "Save"
    #     Then the current event should be linked to the selected existing event

    # Scenario: Editing an unlinked event
    #     Given an event eligible for related stages exists
    #     And the event has no linked events
    #     When the user opens the event for editing
    #     Then the "Linked event" widget should be visible at the bottom
    #     When the user creates a new linked event
    #     Then both events should be properly linked

    # Scenario: Managing a linked event
    #     Given an event with an existing linked event
    #     When the user opens the event for editing
    #     Then the "Linked Event" widget should be visible at the top
    #     And the linked event details should be displayed
    #     When the user clicks the Menu in the top-right corner
    #     Then they should see options to:
    #         | Unlink the event            |
    #         | Unlink and delete the event |

    # Scenario: Unlinking a linked event
    #     Given an event with an existing linked event
    #     When the user opens the event for editing
    #     And clicks the Menu in the top-right corner
    #     And selects "Unlink the event"
    #     Then the events should no longer be linked
    #     And both events should still exist

    # Scenario: Enrolling a tracked entity with related stages
    #     Given the "First stage appears on registration page" flag is enabled
    #     When the user opens the form to enroll a new tracked entity
    #     Then the "Actions" widget should be visible at the bottom
    #     When the user schedules a new visit in another Organisational unit
    #     And fills in the enrollment details
    #     And clicks "Save"
    #     Then the tracked entity should be enrolled
    #     And a related event should be scheduled
    #     And both should be properly linked