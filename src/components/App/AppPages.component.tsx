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
import { ReactQueryDevtools } from 'react-query/devtools';

export const AppPages = (): JSX.Element => (
    <>
        <ReactQueryDevtools />
        <Switch>
            {/* @ts-ignore */}
            <Route path="/viewEvent" component={ViewEventPage} />
            {/* @ts-ignore */}
            <Route path="/search" component={SearchPage} />
            {/* @ts-ignore */}
            <Route path="/new" component={NewPage} />
            {/* @ts-ignore */}
            <Route path="/enrollment/stageEvents" component={StageEventListPage} />
            {/* @ts-ignore */}
            <Route path="/enrollmentEventEdit" component={EnrollmentEditEventPage} />
            {/* @ts-ignore */}
            <Route path="/enrollmentEventNew" component={EnrollmentAddEventPage} />
            {/* @ts-ignore */}
            <Route path="/enrollment" component={EnrollmentPage} />
            {/* @ts-ignore */}
            <Route path="/:keys" component={MainPage} />
            {/* @ts-ignore */}
            <Route path="/" component={MainPage} />
        </Switch>
    </>
);
