// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useSelector, useDispatch } from 'react-redux';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { useOrganisationUnit } from '../../dataQueries';
import { orgUnitFetched } from './organisationUnits.actions';
import { type ReduxOrgUnit } from './organisationUnits.types';

export function useReduxOrgUnit(orgUnitId: string): {
    orgUnit?: ReduxOrgUnit,
    error?: any,
} {
    const dispatch = useDispatch();
    const reduxOrgUnit = useSelector(({ organisationUnits }) => organisationUnits && organisationUnits[orgUnitId]);
    const id = reduxOrgUnit ? undefined : orgUnitId;
    // These hooks do no work when id is undefined
    const { orgUnit, error } = useOrganisationUnit(id, 'displayName,code,path');
    const { orgUnitGroups, error: groupError } = useOrgUnitGroups(id);

    if (reduxOrgUnit) {
        return { orgUnit: reduxOrgUnit };
    }

    if (error) {
        return { error: { error, errorComponent } };
    } else if (groupError) {
        return { error: { groupError, errorComponent } };
    }

    if (orgUnit && orgUnitGroups) {
        orgUnit.name = orgUnit.displayName;
        orgUnit.groups = orgUnitGroups;
        delete orgUnit.displayName;
        dispatch(orgUnitFetched(orgUnit));
        return { orgUnit };
    }

    return {};
}

const errorComponent = (
    <div>
        {i18n.t('organisation unit could not be retrieved. Please try again later.')}
    </div>
);
