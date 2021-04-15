Feature: User interacts with Stages and Events Widget

Scenario: User can view program stages
Given you open the enrollment dummy page
Then the program stages should be displayed

Scenario: User can close the Stages and Events Widget
Given you open the enrollment dummy page
When you click the stages and events widget toggle open close button
Then the stages and events widget should be closed

Scenario: User can close and reopen the Stages and Events Widget
Given you open the enrollment dummy page
When you click the stages and events widget toggle open close button
And you click the stages and events widget toggle open close button
Then the program stages should be displayed