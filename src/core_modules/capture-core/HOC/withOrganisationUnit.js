//@flow
import * as React from 'react';
import type { OrgUnit, OrgUnitGroup } from 'capture-core-utils/rulesEngine';
import i18n from '@dhis2/d2-i18n';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { useOrganisationUnit } from '../dataQueries';

type Props = {

}

// Produces a rules engine compatible OrgUnit object.

// The technical reason for introducing this HOC is that useOrganisationUnit and useOrgUnitGroups
// use async methods; the job of this component is to wait for these to complete.

export const withOrganisationUnit = (InnerComponent: React.ComponentType<any>, orgUnitId: string) =>
    (props: Props) =>
    {
        const { error, orgUnit } = useOrganisationUnit(orgUnitId);
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
                <InnerComponent
                    {...props}
                    orgUnit={orgUnit}
                />
            );
        }

        return null;
    };
