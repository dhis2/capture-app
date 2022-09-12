// @flow
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withAppUrlSync } from 'capture-core/components/App';
import { withUrlSync } from 'capture-core/components/UrlSync';
import { withStateBoundLoadingIndicator } from 'capture-core/HOC';
import { AppPages } from './AppPages.component';

export const AppPagesLoader = compose(
    // $FlowFixMe
    withRouter,
    withStateBoundLoadingIndicator((state: ReduxState) => state.app.initDone, null, true),
    withAppUrlSync(),
    withUrlSync((props: Object) => props.syncSpecification),
    withStateBoundLoadingIndicator((state: ReduxState, props: Object) => !props.urlOutOfSync, null, true),
    withStateBoundLoadingIndicator((state: ReduxState) => !state.app.goingOnline, null, true),
)(AppPages);
AppPagesLoader.displayName = 'AppPagesLoader';
