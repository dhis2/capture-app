import React from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { buildUrl, FEATURES, useFeature } from 'capture-core-utils';
import { NonBundledIcon } from 'capture-ui';
import type { Props } from './nonBundledDhis2Icon.types';

export const NonBundledDhis2Icon = ({ name, alternativeText = name, ...passOnProps }: Props) => {
    const supportCustomIcons = useFeature(FEATURES.customIcons);
    const { baseUrl, apiVersion } = useConfig();
    let source;

    if (name) {
        source = buildUrl(baseUrl, `api/${apiVersion}/icons/${name}/icon`);
        source = supportCustomIcons ? source : `${source}.svg`;
    }

    return (
        <NonBundledIcon
            {...passOnProps}
            source={source}
            alternativeText={alternativeText}
        />
    );
};
