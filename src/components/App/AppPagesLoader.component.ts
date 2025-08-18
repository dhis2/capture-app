import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withAppUrlSync } from 'capture-core/components/App';
import { withUrlSync } from 'capture-core/components/UrlSync';
import { withStateBoundLoadingIndicator } from 'capture-core/HOC';
import { AppPages } from './AppPages.component';

export const AppPagesLoader = compose(
    withRouter,
    withStateBoundLoadingIndicator((state: any) => state.app.initDone, null, true),
    withAppUrlSync(),
    withUrlSync((props: any) => props.syncSpecification),
    withStateBoundLoadingIndicator((state: any, props: any) => !props.urlOutOfSync, null, true),
    withStateBoundLoadingIndicator((state: any) => !state.app.goingOnline, null, true),
)(AppPages) as any;
AppPagesLoader.displayName = 'AppPagesLoader';
