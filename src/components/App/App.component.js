// @flow
/* eslint-disable */
import './app.css';
import * as React from 'react';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConnectedRouter } from 'react-router-redux';
import { withRouter } from 'react-router';
import type { HashHistory } from 'history/createHashHistory';

import FeedbackBar from 'capture-core/components/FeedbackBar/FeedbackBar.container';
import AppContents from './AppContents.component';

// urlParamSync
import withAppUrlSync from 'capture-core/components/App/withAppUrlSync';
import withUrlSync from 'capture-core/components/UrlSync/withUrlSync';

// d2
import { DataProvider } from '@dhis2/app-runtime';
import D2UIApp from '@dhis2/d2-ui-app';

//HOCs
import withD2InContext from 'capture-core/HOC/withD2InContext';
import withStateBoundLoadingIndicator from 'capture-core/HOC/withStateBoundLoadingIndicator';

import theme from '../../styles/uiTheme';


const AppGoingOnlineLoadingIndicator = withStateBoundLoadingIndicator((state: ReduxState) => !state.app.goingOnline, null, true)(AppContents);
const AppContentsOutOfSyncLoadingIndicator = withStateBoundLoadingIndicator(
    (state: ReduxState, props: any) => !props.urlOutOfSync, null, true)(AppGoingOnlineLoadingIndicator);
const AppContentsUrlParamSync = withUrlSync(
    (props: Object) => props.syncSpecification
)(AppContentsOutOfSyncLoadingIndicator);
const AppContentsUrlParam = withAppUrlSync()(AppContentsUrlParamSync);
const AppContentsD2Context = withD2InContext()(AppContentsUrlParam);
const AppContentsInitLoadingIndicator = withStateBoundLoadingIndicator(
    (state: ReduxState, props: any) => state.app.initDone, null, true)(AppContentsD2Context);
const AppContentsRouterLoader = withRouter(AppContentsInitLoadingIndicator);

type Props = {
    store: ReduxStore,
    history: HashHistory,
};

class App extends React.Component<Props> {
    renderContents() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Provider 
                    store={this.props.store}
                >
                    <ConnectedRouter 
                        history={this.props.history}
                    >
                        <MuiThemeProvider
                            theme={theme}
                        >
                            <D2UIApp>
                                <DataProvider
                                    baseUrl={process.env.REACT_APP_DHIS2_BASE_URL}
                                    apiVersion={32}
                                >
                                    <AppContentsRouterLoader />
                                    <FeedbackBar />
                                </DataProvider>
                            </D2UIApp>
                        </MuiThemeProvider>
                    </ConnectedRouter>
                </Provider>
            </React.Fragment>
        );
    }

    render() {
        const {store, history} = this.props;
        return this.renderContents();
    }
}

export default App;
