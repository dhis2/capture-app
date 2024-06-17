Feature: User interacts with a single event page view/edit form

Scenario: The single event is edited and the changes are reflected in the working list
Given you open the main page with Ngelehun and antenatal care context
And you open the first event in the list
And you complete and save the event
Then you are redirected to the main page and the event status Completed is displayed in the list
And you open the first event in the list
And you incomplete and save the event
Then you are redirected to the main page and the event status Active is displayed in the list
