// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { NewPage } from 'capture-core/components/Pages/New';
import { EnrollmentPage } from 'capture-core/components/Pages/Enrollment';
import { EnrollmentDummy } from 'capture-core/components/Pages/EnrollmentDummy';

export const AppPages = () => (
    <Switch>
        <Route path="/viewEvent" component={ViewEventPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/new" component={NewPage} />
        <Route path="/enrollment" component={EnrollmentPage} />
        <Route path="/enrollmentDummy" component={EnrollmentDummy} />
        <Route path="/:keys" component={MainPage} />
        <Route path="/" component={MainPage} />
    </Switch>
);
