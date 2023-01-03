// @flow
import { useMemo } from 'react';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import type { RegistrationFormMetadata } from './types';

type RegistrationOptions = $ReadOnly<{|
  [elementId: string]: {|
    +name: string,
    +registrationMetaData: RegistrationFormMetadata,
    +formId: string,
    +formFoundation: Object,
    +firstStageForm?: Object
  |}
|}>

const useRegistrationOptions = (): RegistrationOptions => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();

    return useMemo(() =>
        Object.values(trackedEntityTypesWithCorrelatedPrograms)
            // $FlowFixMe https://github.com/facebook/flow/issues/2221
            .reduce((acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeTeiRegistration, programs }) => ({
                ...acc,
                [trackedEntityTypeId]: {
                    formFoundation: trackedEntityTypeTeiRegistration.form,
                    registrationMetaData: trackedEntityTypeTeiRegistration,
                    name: trackedEntityTypeName,
                    formId: `registrationPageForm-${trackedEntityTypeId}`,
                },
                ...programs.reduce((accumulated, { programId, programName, enrollment, firstStageForm }) => ({
                    ...accumulated,
                    [programId]: {
                        name: programName,
                        formFoundation: enrollment.enrollmentForm,
                        registrationMetaData: enrollment,
                        formId: `registrationPageForm-${programId}`,
                        firstStageForm,
                    },
                }), {}),
            }), {}),
    [trackedEntityTypesWithCorrelatedPrograms],
    );
};

export const useRegistrationFormInfoForSelectedScope = (selectedScopeId: string) => {
    const options = useRegistrationOptions();
    const { scopeType } = useScopeInfo(selectedScopeId);

    if (scopeType === scopeTypes.TRACKED_ENTITY_TYPE || scopeType === scopeTypes.TRACKER_PROGRAM) {
        const { formFoundation, formId, registrationMetaData, firstStageForm } = options[selectedScopeId];
        return { formFoundation, formId, registrationMetaData, firstStageForm };
    }
    return { formFoundation: [], formId: null, registrationMetaData: null, firstStageForm: null };
};
