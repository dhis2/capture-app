import { useMemo } from 'react';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../../metaData';
import type { RenderFoundation } from '../../../../metaData/RenderFoundation';
import type { Enrollment } from '../../../../metaData/Program/Enrollment';
import type { TeiRegistration } from '../../../../metaData/TrackedEntityType/TeiRegistration';

type RegistrationOptions = {
  [elementId: string]: {
    name: string;
    registrationMetaData: Enrollment | TeiRegistration;
    formId: string;
    formFoundation: RenderFoundation;
  };
};

const useRegistrationOptions = (): RegistrationOptions => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
    return useMemo(() =>
        Object.values(trackedEntityTypesWithCorrelatedPrograms)
            .reduce((acc: any, {
                trackedEntityTypeId,
                trackedEntityTypeName,
                trackedEntityTypeTeiRegistration,
                programs
            }: any) => ({
                ...acc,
                [trackedEntityTypeId]: {
                    formFoundation: trackedEntityTypeTeiRegistration.form,
                    registrationMetaData: trackedEntityTypeTeiRegistration,
                    name: trackedEntityTypeName,
                    formId: `registrationPageForm-${trackedEntityTypeId}`,
                },
                ...programs.reduce((accumulated: any, { programId, programName, enrollment }: any) => ({
                    ...accumulated,
                    [programId]: {
                        name: programName,
                        formFoundation: enrollment.enrollmentForm,
                        registrationMetaData: enrollment,
                        formId: `registrationPageForm-${programId}`,
                    },
                }), {}),
            }), {}) as RegistrationOptions,
    [trackedEntityTypesWithCorrelatedPrograms]);
};

export const useRegistrationFormInfoForSelectedScope = (selectedScopeId: string): {
    formFoundation: RenderFoundation | null;
    formId: string | null;
    registrationMetaData: Enrollment | TeiRegistration | Record<string, never>;
} => {
    const options = useRegistrationOptions();
    const { scopeType } = useScopeInfo(selectedScopeId);

    if (scopeType === scopeTypes.TRACKED_ENTITY_TYPE || scopeType === scopeTypes.TRACKER_PROGRAM) {
        const { formFoundation, formId, registrationMetaData } = options[selectedScopeId];
        return { formFoundation, formId, registrationMetaData };
    }
    return { formFoundation: null, formId: null, registrationMetaData: {} };
};
