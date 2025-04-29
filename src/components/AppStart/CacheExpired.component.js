// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';

export const CacheExpired = () => (
    <div>
        {
            i18n.t(
                'Please refresh the page (Either the server or the app version changed)',
            )
        }
    </div>
);
