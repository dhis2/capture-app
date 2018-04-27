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

// d2-ui
import { LoadingMask } from '@dhis2/d2-ui-core';
import AppContents from './AppContents.component';

//HOCs
import withD2InContext from 'capture-core/HOC/withD2InContext';
import withStateBoundLoadingIndicator from 'capture-core/HOC/withStateBoundLoadingIndicator';

import legacyTheme from '../../styles/uiThemeLegacy';
import theme from '../../styles/uiTheme';

const D2AppContents = withD2InContext()(AppContents);
const D2AppContentsLoader = withStateBoundLoadingIndicator((state: ReduxState) => state.app.ready)(D2AppContents);
const D2AppContentsLoaderBlockAvoider = withRouter(D2AppContentsLoader);

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
                                <D2AppContentsLoaderBlockAvoider />
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
