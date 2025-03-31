import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import D2UIApp from '@dhis2/d2-ui-app';
import {
    RulesEngineVerboseInitializer,
} from 'capture-core/components/RulesEngineVerboseInitializer';
import {
    MetadataAutoSelectInitializer,
} from 'capture-core/components/MetadataAutoSelectInitializer';
import { ReduxStore } from '../../types/global.types';
import './app.css';
import { AppContents } from './AppContents.component';

type Props = {
    store: ReduxStore;
};

export const App = ({ store }: Props): JSX.Element => (
    <React.Fragment>
        <ReduxProvider
            store={store as any}
        >
            <D2UIApp>
                <MetadataAutoSelectInitializer>
                    <RulesEngineVerboseInitializer>
                        {React.createElement(AppContents)}
                    </RulesEngineVerboseInitializer>
                </MetadataAutoSelectInitializer>
            </D2UIApp>
        </ReduxProvider>
    </React.Fragment>
);
