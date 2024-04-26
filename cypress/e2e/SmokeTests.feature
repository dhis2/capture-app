Feature: Smoke tests

    @skip-login
    Scenario: Show login prompt
        Given you open the App without auth cookie
        Then you should see the login prompt

    # login form is not working for v42 currently
    @skip-login @v<42
    Scenario: Show app main selections and header bar: without auth cookie
        Given you open the App without auth cookie
        When you fill in credentials
        And you sign in
        Then you should see the app main selections
        And you should see the header bar
