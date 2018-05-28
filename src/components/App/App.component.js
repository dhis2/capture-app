// @flow
/* eslint-disable */
import './app.css';
import * as React from 'react';
import { Provider } from 'react-redux';
import CssBaseline from 'material-ui-next/CssBaseline';
import LegacyMuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { MuiThemeProvider } from 'material-ui-next/styles';
import { ConnectedRouter } from 'react-router-redux';
import { withRouter } from 'react-router';
import type { HashHistory } from 'history/createHashHistory';

import FeedbackBar from 'capture-core/components/FeedbackBar/FeedbackBar.container';

// urlParamSync
import withAppUrlSync from 'capture-core/components/App/withAppUrlSync';
import withUrlSync from 'capture-core/components/UrlSync/withUrlSync';

import AppContents from './AppContents.component';

//HOCs
import withD2InContext from 'capture-core/HOC/withD2InContext';
import withStateBoundLoadingIndicator from 'capture-core/HOC/withStateBoundLoadingIndicator';

import legacyTheme from '../../styles/uiThemeLegacy';
import theme from '../../styles/uiTheme';

const AppContentsOutOfSyncLoadingIndicator = withStateBoundLoadingIndicator(
    (state: ReduxState, props: any) => !props.urlOutOfSync, null, true)(AppContents);
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
                        <LegacyMuiThemeProvider
                            theme={legacyTheme}
                        >
                            <MuiThemeProvider
                                theme={theme}
                            >
                                <AppContentsRouterLoader
                                />
                                <FeedbackBar />
                            </MuiThemeProvider>
                        </LegacyMuiThemeProvider>
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
