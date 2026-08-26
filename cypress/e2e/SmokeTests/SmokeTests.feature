Feature: Smoke tests

    @skip-login
    Scenario: Show login prompt
        Given you open the App without auth cookie
        Then you should see the login prompt

    # login form is not working for v42 currently
    # https://dhis2.atlassian.net/browse/DHIS2-20638
    @skip-login @v<40
    Scenario: Show app main selections and header bar: without auth cookie
        Given you open the App without auth cookie
        When you fill in credentials
        And you sign in
        Then you should see the app main selections
        And you should see the header bar

    Scenario: IndexedDBs follow the naming pattern and structure
        Given you are in the main page with no selections made
        Then IndexedDBs matching the naming pattern and structure should be found
