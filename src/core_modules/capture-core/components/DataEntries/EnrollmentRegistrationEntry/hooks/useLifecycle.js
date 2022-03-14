// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useOrganisationUnit } from 'capture-core/dataQueries/useOrganisationUnit';
import { startNewEnrollmentDataEntryInitialisation } from '../EnrollmentRegistrationEntry.actions';
import { scopeTypes, getProgramThrowIfNotFound } from '../../../../metaData';
import { useLocationQuery } from '../../../../utils/routing';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../../common/useRegistrationFormInfoForSelectedScope';
import { useFormValues, useTrackedEntityInstances } from './index';

export const useLifecycle = (selectedScopeId: string, dataEntryId: string) => {
    const { teiId, programId } = useLocationQuery();
    const dataEntryReadyRef = useRef(false);
    const dispatch = useDispatch();
    const ready = useSelector(({ dataEntries }) => !!dataEntries[dataEntryId]);
    const program = programId && getProgramThrowIfNotFound(programId);
    const orgUnitId = useCurrentOrgUnitInfo()?.id;
    // https://jira.dhis2.org/browse/DHIS2-12387 some cases the orgUnit code is missing in the Redux store. Get it from the API for now.
    const orgUnit = useOrganisationUnit(orgUnitId)?.orgUnit;
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const { trackedEntityInstanceAttributes } = useTrackedEntityInstances(teiId, programId);
    const { formValues, clientValues, formValuesReadyRef } = useFormValues({
        program,
        trackedEntityInstanceAttributes,
        orgUnit,
        formFoundation,
        teiId,
    });

    useEffect(() => {
        dataEntryReadyRef.current = false;
    }, [teiId]);

    useEffect(() => {
        if (
            dataEntryReadyRef.current === false &&
            formValuesReadyRef.current === true &&
            scopeType === scopeTypes.TRACKER_PROGRAM
        ) {
            dataEntryReadyRef.current = true;
            dispatch(
                startNewEnrollmentDataEntryInitialisation({
                    selectedOrgUnitId: orgUnit?.id,
                    selectedScopeId,
                    dataEntryId,
                    formValues,
                    clientValues,
                }),
            );
        }
    }, [scopeType, dataEntryId, selectedScopeId, orgUnit, formValuesReadyRef, formValues, clientValues, dispatch]);

    return { teiId, ready, skipDuplicateCheck: !!teiId };
};
