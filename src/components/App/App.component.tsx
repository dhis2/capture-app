/* eslint-disable import/first */
import './app.css';
import React from 'react';
import { Provider } from 'react-redux';
import {
    RulesEngineVerboseInitializer,
} from '../../core_modules/capture-core/components/RulesEngineVerboseInitializer';
import {
    MetadataAutoSelectInitializer,
} from '../../core_modules/capture-core/components/MetadataAutoSelectInitializer';
import { AppContents } from './AppContents.component';

type Props = {
    store: any;
};

export const App = ({ store }: Props) => (
    <Provider
        store={store}
    >
        <MetadataAutoSelectInitializer>
            <RulesEngineVerboseInitializer>
                <AppContents />
            </RulesEngineVerboseInitializer>
        </MetadataAutoSelectInitializer>
    </Provider>
);
