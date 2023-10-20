// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useSelector, useDispatch } from 'react-redux';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { useOrganisationUnit } from '../../dataQueries';
import { orgUnitFetched } from './coreOrgUnit.actions';
import { type CoreOrgUnit } from './coreOrgUnit.types';

export function useCoreOrgUnit(orgUnitId: string): {
    orgUnit?: CoreOrgUnit,
    error?: any,
} {
    const dispatch = useDispatch();
    const reduxOrgUnit = useSelector(({ organisationUnits }) => organisationUnits && organisationUnits[orgUnitId]);
    const fetchId = reduxOrgUnit ? undefined : orgUnitId;
    // These hooks do no work when id is undefined
    const { orgUnit, error } = useOrganisationUnit(fetchId, 'displayName,code,path');
    const { orgUnitGroups, error: groupError } = useOrgUnitGroups(fetchId);

    if (reduxOrgUnit) {
        return { orgUnit: reduxOrgUnit };
    }

    if (error) {
        return { error: { error, errorComponent } };
    } else if (groupError) {
        return { error: { groupError, errorComponent } };
    }

    if (orgUnitId && orgUnit && orgUnitGroups) {
        const { displayName, ...restOrgUnit } = orgUnit;
        const coreOrgUnit = {
            ...restOrgUnit,
            name: displayName,
            groups: orgUnitGroups,
        };
        dispatch(orgUnitFetched(coreOrgUnit));
        return { orgUnit: coreOrgUnit };
    }

    return {};
}

const errorComponent = (
    <div>
        {i18n.t('organisation unit could not be retrieved. Please try again later.')}
    </div>
);
