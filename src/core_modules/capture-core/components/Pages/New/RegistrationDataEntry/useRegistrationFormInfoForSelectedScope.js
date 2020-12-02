// @flow
import { useMemo } from 'react';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../../metaData';

type RegistrationOptions = $ReadOnly<{|
  [elementId: string]: {|
    +name: string,
    +registrationMetaData: string,
    +formId: string,
    +formFoundation: Object,
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
                ...programs.reduce((accumulated, { programId, programName, enrollment }) => ({
                    ...accumulated,
                    [programId]: {
                        name: programName,
                        formFoundation: enrollment.enrollmentForm,
                        registrationMetaData: enrollment,
                        formId: `registrationPageForm-${programId}`,
                    },
                }), {}),
            }), {}),
    [trackedEntityTypesWithCorrelatedPrograms]);
};

export const useRegistrationFormInfoForSelectedScope = (selectedScopeId: string) => {
    const options = useRegistrationOptions();
    const { scopeType } = useScopeInfo(selectedScopeId);

    if (scopeType === scopeTypes.TRACKED_ENTITY_TYPE || scopeType === scopeTypes.TRACKER_PROGRAM) {
        const { formFoundation, formId, registrationMetaData } = options[selectedScopeId];
        return { formFoundation, formId, registrationMetaData };
    }
    return { formFoundation: [], formId: null, registrationMetaData: {} };
};
