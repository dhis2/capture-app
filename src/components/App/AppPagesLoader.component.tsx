import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withAppUrlSync } from '../../core_modules/capture-core/components/App';
import { withUrlSync } from '../../core_modules/capture-core/components/UrlSync';
import { withStateBoundLoadingIndicator } from '../../core_modules/capture-core/HOC';
import { AppPages } from './AppPages.component';

export const AppPagesLoader = compose(
    withRouter,
    withStateBoundLoadingIndicator((state: ReduxState) => state.app.initDone, null, true),
    withAppUrlSync(),
    withUrlSync((props: any) => props.syncSpecification),
    withStateBoundLoadingIndicator((_: ReduxState, props: any) => !props.urlOutOfSync, null, true),
    withStateBoundLoadingIndicator((state: ReduxState) => !state.app.goingOnline, null, true),
)(AppPages);

// @ts-ignore
AppPagesLoader.displayName = 'AppPagesLoader';
