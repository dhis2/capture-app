// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { startNewEnrollmentDataEntryInitialisation } from '../EnrollmentRegistrationEntry.actions';
import { scopeTypes, getProgramThrowIfNotFound } from '../../../../metaData';
import { useLocationQuery } from '../../../../utils/routing';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useFormValues } from './index';
import type { InputAttribute } from './useFormValues';
import { useMetadataForRegistrationForm } from '../../common/TEIAndEnrollment/useMetadataForRegistrationForm';

export const useLifecycle = (
    selectedScopeId: string,
    dataEntryId: string,
    trackedEntityInstanceAttributes?: Array<InputAttribute>,
    orgUnit: ?OrgUnit,
) => {
    const { teiId, programId } = useLocationQuery();
    const dataEntryReadyRef = useRef(false);
    const dispatch = useDispatch();
    const program = programId && getProgramThrowIfNotFound(programId);
    const ready = useSelector(({ dataEntries }) => !!dataEntries[dataEntryId]) && !!orgUnit;
    const searchTerms = useSelector(({ searchPage }) => searchPage.currentSearchInfo.currentSearchTerms);
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
    const { formValues, clientValues, formValuesReadyRef } = useFormValues({
        program,
        trackedEntityInstanceAttributes,
        orgUnit,
        formFoundation,
        teiId,
        searchTerms,
    });
    useEffect(() => {
        dataEntryReadyRef.current = false;
    }, [teiId]);

    useEffect(() => {
        if (
            dataEntryReadyRef.current === false &&
            formValuesReadyRef.current === true &&
            orgUnit &&
            scopeType === scopeTypes.TRACKER_PROGRAM
        ) {
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
