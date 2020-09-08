Feature: App platform integration

Scenario: Show login prompt
Given you open the App without auth cookie
Then you should see the login prompt

Scenario: Show app main selections and header bar: without auth cookie
Given you open the App without auth cookie
When you fill in credentials
And you sign in
Then you should see the app main selections
And you should see the header bar

Scenario: Show app main selections and header bar; using auth cookie
Given you open the app with auth cookie
Then you should see the app main selections
And you should see the header bar
