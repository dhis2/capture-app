// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { useOrganisationUnit } from '../../../dataQueries';
import { Validated } from '../Validated/Validated.container';
import type { OrgUnitFetcherProps } from './orgUnitFetcher.types';

// Produces a rules engine compatible OrgUnit object.

// The technical reason for introducing this component is that useOrganisationUnit and useOrgUnitGroups
// use async methods; the job of this component is to wait for these to complete.

export const OrgUnitFetcher = ({
    orgUnitId,
    ...passOnProps
}: OrgUnitFetcherProps) => {
    const { error, orgUnit } = useOrganisationUnit(orgUnitId, 'displayName,code');
    const groups = useOrgUnitGroups(orgUnitId);

    if (error) {
        return (
            <div>
                {i18n.t('organisation unit could not be retrieved. Please try again later.')}
            </div>
        );
    }

    if (orgUnit && groups) {
        orgUnit.groups = groups;

        return (
            <Validated
                {...passOnProps}
                orgUnit={orgUnit}
            />
        );
    }

    return null;
};
