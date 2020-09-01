Feature: User adds events

Scenario: User adds event in the malaria case registration program
Given you open the the new event page in Ngelehun and malaria case context
When you add data to the form
And you submit the form
Then the event should be sent to the server successfully

Scenario: User adds event with relationship in the malaria case registration program
Given you open the the new event page in Ngelehun and malaria case context
When you add data to the form
And navigate to register a person relationship
And you fill in the registration details
And you submit the registration form
And you submit the event form with the associated tei relationship
Then the data should be sent to the server successfully
