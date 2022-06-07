// @flow
import React, { useCallback } from 'react';
import { Route, Switch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { MainPage } from 'capture-core/components/Pages/MainPage';
import { SearchPage } from 'capture-core/components/Pages/Search';
import { NewPage } from 'capture-core/components/Pages/New';
import { EnrollmentPage } from 'capture-core/components/Pages/Enrollment';

export const AppPages = () => {
    const dispatch = useDispatch();

    const enforceNewPage = useCallback(() => {
        dispatch({ type: 'EnforceNewPage' });
    }, [dispatch]);

    const enableMainPage = useCallback(() => {
        dispatch({ type: 'EnableMainPage' });
    }, [dispatch]);

    const newPageEnforced = useSelector(({ app }) => app.newPageEnforced);

    return (
        <Switch>
            <Route path="/viewEvent" component={ViewEventPage} />
            <Route path="/search" component={SearchPage} />
            <Route
                path="/new"
                render={() => <NewPage enforceNewPage={enforceNewPage} enableMainPage={enableMainPage} />}
            />
            <Route path="/enrollment" component={EnrollmentPage} />
            <Route path="/:keys" component={MainPage} />
            <Route path="/" render={() => <MainPage newPageEnforced={newPageEnforced} />} />
        </Switch>
    );
};
