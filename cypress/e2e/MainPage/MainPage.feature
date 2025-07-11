Feature: User interacts with Main page

    Scenario: The Working list is displayed
        Given you are in the main page with no selections made
        And the user selects the program Child Programme
        And the user selects the org unit Ngelehun CHC
        Then the TEI working list is displayed

    Scenario: The Working list is displayed for an event program
        Given you are in the main page with no selections made
        And the user selects the program Antenatal care
        And the user selects the org unit Ngelehun CHC
        Then the event working list is displayed

    Scenario: The Search form is displayed for programs with displayFrontPageList set to false
        Given you are in the main page with no selections made
        And the user selects the program MNCH / PNC (Adult Woman)
        And the user selects the org unit Ngelehun CHC
        Then the search form is displayed
        And the user clicks the element containing the text: Create saved list
        Then the current url is /#/?orgUnitId=DiszpKrYNg8&programId=uy2gU8kT1jF&selectedTemplateId=uy2gU8kT1jF-default
        And the TEI working list is displayed

    Scenario: You can load a custom working list and switch between views
        Given you are in the search page with Ngelehun and malaria focus investigation program context
        And the user clicks the element containing the text: Cases not yet assigned
        Then the current url is /#/?orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&selectedTemplateId=newW4Ez8Ty5
        And you can load the view with the name Events assigned to me
        Then the current url is /#/?orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI&selectedTemplateId=PpGINOT00UX

    Scenario: You are redirected to create a custom working list
        Given you are in the search page with Ngelehun and MNCH PNC context
        And the search form is displayed
        When the user clicks the element containing the text: Create saved list
        Then the current url is /#/?orgUnitId=DiszpKrYNg8&programId=uy2gU8kT1jF&selectedTemplateId=uy2gU8kT1jF-default
        And the TEI working list is displayed

    @v<41
    Scenario: The icon is rendered as an svg
        Given you are in the main page with no selections made
        When you select Child Programme
        Then the icon is rendered as an svg

    @v>=41
    Scenario: The icon is rendered as a custom icon
        Given you are in the main page with no selections made
        When you select Child Programme
        Then the icon is rendered as a custom icon

    @with-indexBD-clean
    Scenario: BulkDataEntry widget is displayed in the main page
        Given you are in the main page with Child Programme and Ngelehun CHC selected
        Then the TEI working list is displayed
        And the BulkDataEntry widget in idle mode is displayed
        When the user selects the "Routine visit" BulkDataEntry
        When the user navigates to "Program overview" using the breadcrumb
        Then the TEI working list is displayed
        And the BulkDataEntry widget in active mode is displayed

    @with-indexBD-clean
    Scenario: BulkDataEntry widget is displayed in the main page for program with displayFrontPage set to false
        Given you are in the main page with MNCH PNC and Ngelehun CHC selected
        Then the search form is displayed
        And the BulkDataEntry widget in idle mode is displayed
        When the user selects the "Case based surveillance" BulkDataEntry
        When the user navigates to "Search" using the breadcrumb
        Then the search form is displayed
        And the BulkDataEntry widget in active mode is displayed
