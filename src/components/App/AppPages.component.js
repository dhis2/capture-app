// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { NewPage } from 'capture-core/components/Pages/New';
import { EnrollmentPage } from 'capture-core/components/Pages/Enrollment';
import { StageEventListPage } from 'capture-core/components/Pages/StageEvent';
import { EnrollmentEditEventPage } from 'capture-core/components/Pages/EnrollmentEditEvent';
import { EnrollmentAddEventPage } from 'capture-core/components/Pages/EnrollmentAddEvent';
import { pathnames } from '../../core_modules/capture-core/utils/url';

export const AppPages = () => (
    <Switch>
        <Route path={pathnames.VIEW_EVENT} component={ViewEventPage} />
        <Route path={pathnames.SEARCH} component={SearchPage} />
        <Route path={pathnames.NEW} component={NewPage} />
        <Route path={pathnames.ENROLLMENT_STAGE_EVENTS} component={StageEventListPage} />
        <Route path={pathnames.ENROLLMENT_EVENT_EDIT} component={EnrollmentEditEventPage} />
        <Route path={pathnames.ENROLLMENT_EVENT_NEW} component={EnrollmentAddEventPage} />
        <Route path={pathnames.ENROLLMENT} component={EnrollmentPage} />
        <Route path={pathnames.MAIN_PAGE_KEYS} component={MainPage} />
        <Route path={pathnames.MAIN_PAGE} component={MainPage} />
    </Switch>
);
