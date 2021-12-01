// @flow
import { Route, Switch } from 'react-router-dom';
import React from 'react';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { StageEventListPage } from 'capture-core/components/Pages/StageEvent';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { NewPage } from 'capture-core/components/Pages/New';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { EnrollmentEditEventPage } from 'capture-core/components/Pages/EnrollmentEditEvent';
import { EnrollmentAddEventPage } from 'capture-core/components/Pages/EnrollmentAddEvent';
import { EnrollmentPage } from 'capture-core/components/Pages/Enrollment';

export const AppPages = () => (
    <Switch>
        <Route path="/viewEvent" component={ViewEventPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/new" component={NewPage} />
        <Route path="/enrollment/stageEvents" component={StageEventListPage} />
        <Route path="/enrollmentEventEdit" component={EnrollmentEditEventPage} />
        <Route path="/enrollmentEventNew" component={EnrollmentAddEventPage} />
        <Route path="/enrollment" component={EnrollmentPage} />
        <Route path="/:keys" component={MainPage} />
        <Route path="/" component={MainPage} />
    </Switch>
);
