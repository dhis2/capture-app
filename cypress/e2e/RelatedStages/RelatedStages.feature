Feature: Related stages

    Scenario: Edit event -> User is able to link and unlink an existing event
        Given you land on a enrollment page domain by having typed #/enrollmentEventEdit?eventId=TwoGi1mUFFw&orgUnitId=lyONqUkY1Bq
        And the Related stages Actions is visible at the bottom of the page
        And the schedule and enter details actions are disabled
        And you select the Link to an existing event action
        When you select the first existing Baby Postnatal event in the list
        And you click the Link button
        Then you can see the Baby Postnatal linked event
        And the Related stages Actions is not visible at the bottom of the page
        When you unlink the Baby Postnatal linked event
        And the Related stages Actions is visible at the bottom of the page

    Scenario: Edit event -> User is able to schedule an event in a different orgUnit
        Given you land on a enrollment page domain by having typed #/enrollment?enrollmentId=VOU2Qe7T49r&orgUnitId=VFF7f43dJv4&programId=IpHINAT79UW&teiId=rBqwRgXvjk0
        And you delete the Baby Postnatal event
        And you delete the Birth event
        And you open the Birth new event page and fill in the required data in the form
        And you click the Complete button
        And you open the Birth event edit page
        And the Related stages Actions is visible at the bottom of the page
        And the link to an existing actions is disabled
        And you select the Schedule event action
        When you fill in the required values for the Baby postnatal event when scheduling
        And you click the Schedule action button
        Then you can see the Baby Postnatal linked event
        And the Related stages Actions is not visible at the bottom of the page

    Scenario: Edit event -> User is able to enter details in a different orgUnit
        Given you land on a enrollment page domain by having typed #/enrollment?enrollmentId=VOU2Qe7T49r&orgUnitId=VFF7f43dJv4&programId=IpHINAT79UW&teiId=rBqwRgXvjk0
        And you delete the Baby Postnatal event
        And you delete the Birth event
        And you open the Birth new event page and fill in the required data in the form
        And you click the Complete button
        And you open the Birth event edit page
        And the Related stages Actions is visible at the bottom of the page
        And the link to an existing actions is disabled
        And you select the Enter details now action
        When you fill in the required values for the Baby postnatal event when entering details
        And you click the Enter details action button
        Then you can see the Birth linked event
        And you can see the Baby postnatal new event form where you can enter details

    Scenario: New event -> User is able to link and unlink an existing event
        Given you land on a enrollment page domain by having typed #/enrollment?enrollmentId=EOxeNf2MdBf&orgUnitId=VFF7f43dJv4&programId=IpHINAT79UW&teiId=QhoMgzeGuGq
        And you delete the Birth event
        And you open the Birth new event page and fill in the required data in the form
        And the Related stages Actions is visible at the bottom of the page
        And the schedule and enter details actions are disabled
        And you select the Link to an existing event action
        When you select the first existing Baby Postnatal event in the list
        And you click the Complete button
        And you open the Birth event edit page
        Then you can see the Baby Postnatal linked event
        And the Related stages Actions is not visible at the bottom of the page
        When you unlink the Baby Postnatal linked event
        And the Related stages Actions is visible at the bottom of the page
    
    Scenario: New event -> User is able to schedule an event in a different orgUnit
        Given you land on a enrollment page domain by having typed #/enrollment?enrollmentId=EOxeNf2MdBf&orgUnitId=VFF7f43dJv4&programId=IpHINAT79UW&teiId=QhoMgzeGuGq
        And you delete the Baby Postnatal event
        And you delete the Birth event
        And you open the Birth new event page and fill in the required data in the form
        And the Related stages Actions is visible at the bottom of the page
        And the link to an existing actions is disabled
        And you select the Schedule event action
        When you fill in the required values for the Baby postnatal event when scheduling
        And you click the Complete button
        Then you are redirect to the enrollment dasboard and you see the 2 linked events in different orgUnits

    Scenario: New event -> User is able to enter details in a different orgUnit
        Given you land on a enrollment page domain by having typed #/enrollment?enrollmentId=EOxeNf2MdBf&orgUnitId=VFF7f43dJv4&programId=IpHINAT79UW&teiId=QhoMgzeGuGq
        And you delete the Baby Postnatal event
        And you delete the Birth event
        And you open the Birth new event page and fill in the required data in the form
        And the Related stages Actions is visible at the bottom of the page
        And the link to an existing actions is disabled
        And you select the Enter details now action
        When you fill in the required values for the Baby postnatal event when entering details
        And you click the Complete button
        Then you can see the Birth linked event
        And you can see the Baby postnatal new event form where you can enter details

    Scenario: Enroll trackedEntity -> User is able to schedule an event in a different orgUnit
        Given you are in Child programme and Tombo Wallah CHP organization unit registration page
        When you fill the Child Program program registration form with unique values
        And you select the Schedule event action
        And you fill in the required values for the Baby postnatal event when scheduling
        And you click the save person submit button
        Then you are redirect to the enrollment dasboard and you see the 2 linked events in different orgUnits
        And you delete the recently added tracked entity

    Scenario: Enroll trackedEntity -> User is able to enter details in a different orgUnit
        Given you are in Child programme and Tombo Wallah CHP organization unit registration page
        When you fill the Child Program program registration form with unique values
        And you select the Enter details now action
        And you fill in the required values for the Baby postnatal event when entering details
        And you click the save person submit button
        Then you can see the Birth linked event
        And you can see the Baby postnatal new event form where you can enter details
        And you navigate to the Enrollment dashboard
        And you are redirect to the enrollment dasboard and you see the 2 linked events in different orgUnits
        And you delete the recently added tracked entity