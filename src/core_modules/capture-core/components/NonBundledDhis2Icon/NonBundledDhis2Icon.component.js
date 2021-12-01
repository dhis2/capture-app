// @flow
import { useConfig } from '@dhis2/app-runtime';
import { buildUrl } from 'capture-core-utils';
import { NonBundledIcon } from 'capture-ui';
import React from 'react';
import type { Props } from './nonBundledDhis2Icon.types';

export const NonBundledDhis2Icon = ({ name, alternativeText = name, ...passOnProps }: Props) => {
    const { baseUrl, apiVersion } = useConfig();
    const source = name && buildUrl(baseUrl, `api/${apiVersion}/icons/${name}/icon.svg`);

    return (
        <NonBundledIcon
            {...passOnProps}
            source={source}
            alternativeText={alternativeText}
        />
    );
};
