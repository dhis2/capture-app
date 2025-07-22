import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { startNewEnrollmentDataEntryInitialisation } from '../EnrollmentRegistrationEntry.actions';
import { scopeTypes, getProgramThrowIfNotFound } from '../../../../metaData';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useFormValues } from './index';
import type { InputAttribute } from './useFormValues';
import { useBuildFirstStageRegistration } from './useBuildFirstStageRegistration';
import { useMetadataForRegistrationForm } from '../../common/TEIAndEnrollment/useMetadataForRegistrationForm';
import { useCategoryCombinations } from '../../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { useMergeFormFoundationsIfApplicable } from './useMergeFormFoundationsIfApplicable';

export const useLifecycle = (
    selectedScopeId: string,
    dataEntryId: string,
    trackedEntityInstanceAttributes?: Array<InputAttribute>,
    orgUnit?: OrgUnit,
    teiId?: string,
) => {
    const dataEntryReadyRef = useRef(false);
    const dispatch = useDispatch();
    const program = selectedScopeId && getProgramThrowIfNotFound(selectedScopeId);
    const ready =
        useSelector(({ dataEntries }: any) => !!dataEntries[dataEntryId]) && !!orgUnit && dataEntryReadyRef.current === true;
    const searchTerms = useSelector(({ newPage }: any) => newPage.prepopulatedData);
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { firstStageMetaData } = useBuildFirstStageRegistration(selectedScopeId, scopeType !== scopeTypes.TRACKER_PROGRAM);
    const {
        formId,
        registrationMetaData: enrollmentMetadata,
        formFoundation: enrollmentFormFoundation,
    } = useMetadataForRegistrationForm({ selectedScopeId });

    const { formFoundation } = useMergeFormFoundationsIfApplicable(enrollmentFormFoundation, firstStageMetaData);
    const { programCategory } = useCategoryCombinations(selectedScopeId, scopeType !== scopeTypes.TRACKER_PROGRAM);
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
    }, [teiId, selectedScopeId]);

    useEffect(() => {
        if (
            dataEntryReadyRef.current === false &&
            formValuesReadyRef.current === true &&
            orgUnit &&
            scopeType === scopeTypes.TRACKER_PROGRAM &&
            formFoundation
        ) {
            dataEntryReadyRef.current = true;
            dispatch(
                startNewEnrollmentDataEntryInitialisation({
                    selectedOrgUnit: orgUnit,
                    selectedScopeId,
                    dataEntryId,
                    formValues,
                    clientValues,
                    programCategory,
                    firstStage: firstStageMetaData?.stage,
                    formFoundation,
                }),
            );
        }
    }, [
        formFoundation,
        scopeType,
        dataEntryId,
        selectedScopeId,
        orgUnit,
        formValuesReadyRef,
        formValues,
        clientValues,
        programCategory,
        firstStageMetaData,
        dispatch,
    ]);

    return {
        teiId,
        ready,
        skipDuplicateCheck: !!teiId,
        firstStageMetaData,
        formId,
        enrollmentMetadata,
        formFoundation,
    };
};
