import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withAppUrlSync } from 'capture-core/components/App';
import { withUrlSync } from 'capture-core/components/UrlSync';
import { withStateBoundLoadingIndicator } from 'capture-core/HOC';
import { AppPages } from './AppPages.component';
import { ReduxState } from '../../types/global.types';

export const AppPagesLoader = compose(
    withRouter,
    withStateBoundLoadingIndicator((state: ReduxState) => {
        return state.app?.initDone;
    }, null, true),
    withAppUrlSync(),
    withUrlSync((props: Record<string, any>) => props.syncSpecification),
    withStateBoundLoadingIndicator((state: ReduxState, props: Record<string, any>) => !props.urlOutOfSync, null, true),
    withStateBoundLoadingIndicator((state: ReduxState) => {
        return !state.app?.goingOnline;
    }, null, true),
)(AppPages);
AppPagesLoader.displayName = 'AppPagesLoader';
