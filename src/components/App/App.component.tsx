/* eslint-disable import/first */
import './app.css';
import React from 'react';
import { Provider } from 'react-redux';
import {
    RulesEngineVerboseInitializer,
} from 'capture-core/components/RulesEngineVerboseInitializer';
import {
    MetadataAutoSelectInitializer,
} from 'capture-core/components/MetadataAutoSelectInitializer';
import { AppContents } from './AppContents.component';

type Props = {
    store: any;
};

export const App = ({ store }: Props) => (
    <React.Fragment>
        <Provider
            store={store}
        >
            <MetadataAutoSelectInitializer>
                <RulesEngineVerboseInitializer>
                    <AppContents />
                </RulesEngineVerboseInitializer>
            </MetadataAutoSelectInitializer>
        </Provider>
    </React.Fragment>
);
