// @flow
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withAppUrlSync } from 'capture-core/components/App';
import { withUrlSync } from 'capture-core/components/UrlSync';
import { withD2InContext, withStateBoundLoadingIndicator } from 'capture-core/HOC';
import { AppPages } from './AppPages.component';

export const AppPagesLoader = compose(
    withRouter,
    withStateBoundLoadingIndicator((state: ReduxState) => state.app.initDone, null, true),
    withD2InContext(),
    withAppUrlSync(),
    withUrlSync((props: Object) => props.syncSpecification),
    withStateBoundLoadingIndicator((state: ReduxState, props: Object) => !props.urlOutOfSync, null, true),
    withStateBoundLoadingIndicator((state: ReduxState) => !state.app.goingOnline, null, true),
)(AppPages);
AppPagesLoader.displayName = 'AppPagesLoader';
