// @flow
import { EnrollmentPage } from 'capture-core/components/Pages/Enrollment';
import { EnrollmentAddEventPage } from 'capture-core/components/Pages/EnrollmentAddEvent';
import { EnrollmentEditEventPage } from 'capture-core/components/Pages/EnrollmentEditEvent';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { NewPage } from 'capture-core/components/Pages/New';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { StageEventListPage } from 'capture-core/components/Pages/StageEvent';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

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
