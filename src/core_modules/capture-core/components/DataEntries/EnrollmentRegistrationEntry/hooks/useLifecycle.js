// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { startNewEnrollmentDataEntryInitialisation } from '../EnrollmentRegistrationEntry.actions';
import { scopeTypes, getTrackerProgramThrowIfNotFound } from '../../../../metaData';
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
    const program = getTrackerProgramThrowIfNotFound(programId);
    const orgUnit = useCurrentOrgUnitInfo();
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
        if (dataEntryReadyRef.current === false && formValuesReadyRef.current === true && scopeType === scopeTypes.TRACKER_PROGRAM) {
            dataEntryReadyRef.current = true;
            dispatch(
                startNewEnrollmentDataEntryInitialisation({
                    selectedOrgUnitId: orgUnit.id,
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
