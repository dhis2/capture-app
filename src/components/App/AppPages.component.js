// @flow
import React from 'react';
import { Route, Switch } from 'react-router';

import { NewEventPage } from 'capture-core/components/Pages/NewEvent';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { NewEnrollmentPage } from 'capture-core/components/Pages/NewEnrollment';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { NewPage } from 'capture-core/components/Pages/New';

export const AppPages = () => (
  <Switch>
    <Route path="/newEvent" component={NewEventPage} />
    <Route path="/viewEvent" component={ViewEventPage} />
    <Route path="/newEnrollment" component={NewEnrollmentPage} />
    <Route path="/search" component={SearchPage} />
    <Route path="/new" component={NewPage} />
    <Route path="/:keys" component={MainPage} />
    <Route path="/" component={MainPage} />
  </Switch>
);
