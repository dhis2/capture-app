import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
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
    orgUnit: any,
    programId: string,
    trackedEntityInstanceAttributes?: Array<InputAttribute>,
    teiId?: string,
) => {
    const dataEntryReadyRef = useRef(false);
    const dispatch = useDispatch();
    const program = programId && getProgramThrowIfNotFound(programId);
    const ready =
        useSelector(({ dataEntries }: any) => !!dataEntries[dataEntryId]) && !!orgUnit && dataEntryReadyRef.current === true;
    const searchTerms = useSelector(({ newPage }: any) => newPage.prepopulatedData);
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { firstStageMetaData } = useBuildFirstStageRegistration(programId, scopeType !== scopeTypes.TRACKER_PROGRAM);
    const {
        formId,
        registrationMetaData: enrollmentMetadata,
        formFoundation: enrollmentFormFoundation,
    } = useMetadataForRegistrationForm({ selectedScopeId });

    const { formFoundation } = useMergeFormFoundationsIfApplicable(enrollmentFormFoundation, firstStageMetaData);
    const { programCategory } = useCategoryCombinations(programId, scopeType !== scopeTypes.TRACKER_PROGRAM);
    const { formValues, clientValues, formValuesReadyRef } = useFormValues({
        program: program as any,
        trackedEntityInstanceAttributes: trackedEntityInstanceAttributes ?? [],
        orgUnit,
        formFoundation: formFoundation as any,
        teiId: teiId ?? undefined,
        searchTerms,
    });
    useEffect(() => {
        dataEntryReadyRef.current = false;
    }, [teiId, selectedScopeId]);

    useEffect(() => {
        if (
            dataEntryReadyRef.current === false &&
            (formValuesReadyRef as any).current === true &&
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
