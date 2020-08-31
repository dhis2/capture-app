Feature: User adds events

Scenario: User adds event in the malaria case registration program
Given you open the the new event page in Ngelehun and malaria case context
When you add data to the form
And you sumbit the form
Then the event should successfully be sent to the server
