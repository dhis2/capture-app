// @flow
/* eslint-disable */
import React, {Component, PropTypes} from 'react';
import { Provider } from 'react-redux';
import LegacyMuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// d2-ui
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import addD2ToContext from 'd2-tracker/HOC/addD2ToContext';
import AppContents from './AppContents.component';
import legacyTheme from '../../styles/uiThemeLegacy';

const D2AppContents = addD2ToContext(AppContents);

type Props = {
    ready?: ?boolean,
    store: TrackerStore
};

class App extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    static renderLoader() {
        return (
            <LegacyMuiThemeProvider theme={legacyTheme}>
                <LoadingMask />
            </LegacyMuiThemeProvider>
        );
    }

    renderContents() {
        return (
            <Provider store={this.props.store}>
            <LegacyMuiThemeProvider theme={legacyTheme}>
                <D2AppContents />
            </LegacyMuiThemeProvider>
             </Provider>
        );
    }

    render() {
        const {ready, store} = this.props;       

        return (
            
                <div>   
                {
                    (() => {
                        if(!ready){
                            return App.renderLoader();
                        }

                        return this.renderContents();
                    })()                    
                }
                </div>
            
        );
    }
}

export default App;
