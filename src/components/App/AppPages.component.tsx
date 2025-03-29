import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NavigationBar } from 'capture-core/components/NavigationBar/NavigationBar.container';

export const AppPages = (): JSX.Element => (
    <>
        <NavigationBar />
        <Switch>
            <Route path="/search" component={require('capture-core/components/Pages/Search/SearchPage.component').SearchPage} />
            <Route path="/enrollment" component={require('capture-core/components/Pages/Enrollment/Enrollment.component').EnrollmentPage} />
            <Route path="/enrollmentEventEdit" component={require('capture-core/components/Pages/EnrollmentEditEvent/EnrollmentEditEventPage.component').EnrollmentEditEventPage} />
            <Route path="/event" component={require('capture-core/components/Pages/ViewEvent/ViewEventPage.component').ViewEventPage} />
            <Route path="/enrollmentEvent" component={require('capture-core/components/Pages/EnrollmentEventView/ViewEnrollmentEventPage.component').ViewEnrollmentEventPage} />
            <Route path="/enrollmentEventNew" component={require('capture-core/components/Pages/NewEnrollmentEvent/EnrollmentEventNew.component').EnrollmentEventNew} />
            <Route path="/editEvent" component={require('capture-core/components/Pages/EditEvent/EditEventPage.component').EditEventPage} />
            <Route path="/newEvent" component={require('capture-core/components/Pages/New/NewEventPage.component').NewEventPage} />
            <Route path="/notes" component={require('capture-core/components/Pages/WidgetEnrollmentEventNotes/WidgetEnrollmentEventNotesPage.component').WidgetEventNotesPage} />
            <Route path="/enrollmentData" component={require('capture-core/components/Pages/WidgetEnrollmentData/WidgetEnrollmentDataPage.component').WidgetEnrollmentDataPage} />
            <Route path="/relationships" component={require('capture-core/components/Pages/WidgetRelationships/WidgetRelationshipsPage.component').WidgetRelationshipsPage} />
            <Route path="/assignee" component={require('capture-core/components/Pages/WidgetAssignee/WidgetAssigneeEventPage.component').WidgetAssigneeEventPage} />
            <Route path="/assigneeEnrollment" component={require('capture-core/components/Pages/WidgetAssignee/WidgetAssigneeEnrollmentPage.component').WidgetAssigneeEnrollmentPage} />
            <Route path="/" component={require('capture-core/components/Pages/MainPage/MainPage.container').MainPage} />
        </Switch>
    </>
);
