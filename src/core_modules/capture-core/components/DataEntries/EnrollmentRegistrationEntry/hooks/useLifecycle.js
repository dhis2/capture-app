// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { startNewEnrollmentDataEntryInitialisation } from '../EnrollmentRegistrationEntry.actions';
import { scopeTypes, getProgramThrowIfNotFound } from '../../../../metaData';
import { useLocationQuery } from '../../../../utils/routing';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';
import { useRulesEngineOrgUnit } from '../../../../hooks/useRulesEngineOrgUnit';
import { useRegistrationFormInfoForSelectedScope } from '../../common/useRegistrationFormInfoForSelectedScope';
import { useFormValues, useTrackedEntityInstances } from './index';

export const useLifecycle = (selectedScopeId: string, dataEntryId: string) => {
    const { teiId, programId } = useLocationQuery();
    const dataEntryReadyRef = useRef(false);
    const dispatch = useDispatch();
    const program = getProgramThrowIfNotFound(programId);
    const orgUnitId = useCurrentOrgUnitInfo()?.id;
    const orgUnit = useRulesEngineOrgUnit(orgUnitId);
    const ready = useSelector(({ dataEntries }) => !!dataEntries[dataEntryId]) && !!orgUnit;
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
        if (dataEntryReadyRef.current === false && formValuesReadyRef.current === true && orgUnit && scopeType === scopeTypes.TRACKER_PROGRAM) {
            dataEntryReadyRef.current = true;
            dispatch(
                startNewEnrollmentDataEntryInitialisation({
                    selectedOrgUnit: orgUnit,
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
