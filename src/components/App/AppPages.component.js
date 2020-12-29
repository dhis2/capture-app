// @flow
import React from 'react';
import { Route, Switch } from 'react-router';

import { NewEventPage } from 'capture-core/components/Pages/NewEvent';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { NewPage } from 'capture-core/components/Pages/New';
import { EnrollmentPage } from 'capture-core/components/Pages/Enrollment';

export const AppPages = () => (
    <Switch>
        <Route path="/newEvent" component={NewEventPage} />
        <Route path="/viewEvent" component={ViewEventPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/new" component={NewPage} />
        <Route path="/enrollment" component={EnrollmentPage} />
        <Route path="/:keys" component={MainPage} />
        <Route path="/" component={MainPage} />
    </Switch>
);
