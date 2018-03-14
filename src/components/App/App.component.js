// @flow
/* eslint-disable */
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import LegacyMuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { MuiThemeProvider } from 'material-ui-next/styles';

import FeedbackBar from 'capture-core/components/FeedbackBar/FeedbackBar.container';
// d2-ui
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import AppContents from './AppContents.component';

//HOCs
import withD2InContext from 'capture-core/HOC/withD2InContext';
import withStateBoundLoadingIndicator from 'capture-core/HOC/withStateBoundLoadingIndicator';

import legacyTheme from '../../styles/uiThemeLegacy';
import theme from '../../styles/uiTheme';

const D2AppContents = withD2InContext()(AppContents);
const LoadD2AppContents = withStateBoundLoadingIndicator((state: ReduxState) => state.app.ready)(D2AppContents);

type Props = {
    store: TrackerStore
};

class App extends Component<Props> {
    renderContents() {
        return (
            <Provider store={this.props.store}>
            <LegacyMuiThemeProvider theme={legacyTheme}>
                <MuiThemeProvider theme={theme}>
                    <LoadD2AppContents />
                    <FeedbackBar />
                </MuiThemeProvider>
            </LegacyMuiThemeProvider>
             </Provider>
        );
    }

    render() {
        const {store} = this.props;
        return this.renderContents();
    }
}

export default App;
