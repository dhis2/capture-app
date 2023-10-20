// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';
import { Validated } from '../Validated/Validated.container';
import type { OrgUnitFetcherProps } from './orgUnitFetcher.types';

export const OrgUnitFetcher = ({
    orgUnitId,
    ...passOnProps
}: OrgUnitFetcherProps) => {
    const { error, orgUnit } = useCoreOrgUnit(orgUnitId);

    if (error) {
        return (
            <div>
                {i18n.t('organisation unit could not be retrieved. Please try again later.')}
            </div>
        );
    }

    if (orgUnit) {
        return (
            <Validated
                {...passOnProps}
                orgUnit={orgUnit}
            />
        );
    }

    return null;
};
