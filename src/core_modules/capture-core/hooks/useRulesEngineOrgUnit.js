// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { OrgUnit } from 'rules-engine';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { useOrganisationUnit } from '../dataQueries';

export function useRulesEngineOrgUnit(orgUnitId: string): {
    orgUnit?: OrgUnit,
    error?: any,
} {
    const { orgUnit, error } = useOrganisationUnit(orgUnitId, 'displayName,code');
    const { orgUnitGroups, error: groupError } = useOrgUnitGroups(orgUnitId);

    if (error) {
        return { error: { error, errorComponent } };
    } else if (groupError) {
        return { error: { groupError, errorComponent } };
    }

    if (orgUnit && orgUnitGroups) {
        orgUnit.groups = orgUnitGroups;
        return { orgUnit };
    }

    return {};
}

const errorComponent = (
    <div>
        {i18n.t('organisation unit could not be retrieved. Please try again later.')}
    </div>
);
