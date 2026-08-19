@working-list-sharing
Feature: Sharing of working list views survives an update

Scenario: The sharing settings on an event working list view survive an update
  Given you open the event working list
  When you save the current view
  And you share the view with the other user
  And you change the sorting
  And you update the view
  Then the update is accepted by the server
  And the view is still shared with the other user
  And the view no longer has unsaved changes

@user:trackerAutoTestRestricted
Scenario: A user with view and edit access can update a shared event working list view
  Given an event working list view owned by another user is shared with you with view and edit access
  When you open the shared view
  And you change the sorting
  Then you are offered the option to update the view
  When you update the view
  Then the update is accepted by the server
  And the view is still shared with you

Scenario: The sharing settings on a tracker working list view survive an update
  Given you open the tracker working list
  When you save the current view
  And you share the view with the other user
  And you change the sorting
  And you update the view
  Then the update is accepted by the server
  And the view is still shared with the other user
  And the view no longer has unsaved changes

@user:trackerAutoTestRestricted
Scenario: A user with view and edit access can update a shared tracker working list view
  Given a tracker working list view owned by another user is shared with you with view and edit access
  When you open the shared view
  And you change the sorting
  Then you are offered the option to update the view
  When you update the view
  Then the update is accepted by the server
  And the view is still shared with you

Scenario: The sharing settings on a program stage working list view survive an update
  Given you open the tracker working list filtered by the First antenatal care visit stage
  When you save the current view
  And you share the view with the other user
  And you change the sorting
  And you update the view
  Then the update is accepted by the server
  And the view is still shared with the other user
  And the view no longer has unsaved changes
