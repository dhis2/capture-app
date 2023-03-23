// @flow
import React from 'react';
import { Plugin } from '@dhis2/app-runtime';
import type { ComponentProps } from './DataEntryPlugin.types';

export const DataEntryPluginComponent = (props: ComponentProps) => {
    const { pluginSource, ...passOnProps } = props;

    return (
        <Plugin
            pluginSource={pluginSource}
            {...passOnProps}
        />
    );
};
