// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { ComponentProps } from './FormFieldPlugin.types';

export const FormFieldPluginComponent = (props: ComponentProps) => {
    // eslint-disable-next-line no-unused-vars
    const { pluginSource, ...passOnProps } = props;

    return (
        <p>
            {i18n.t('Plugins are not yet available - Please contact your system administrator')}
        </p>
    );
};
