import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { InputAttribute } from '../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import {
    getProgramFromProgramIdThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    TrackerProgram,
} from '../../../../metaData';

type Props = {
    teiId: string;
    trackedEntityTypeId: string;
    programId?: string;
};

type Return = {
    inheritedAttributes: Array<InputAttribute>;
    isLoading: boolean;
};

export const useInheritedAttributeValues = ({ teiId, trackedEntityTypeId, programId: propsProgramId }: Props): Return => {
    const reduxProgramId = useSelector(({ newRelationshipRegisterTei }: { newRelationshipRegisterTei: { programId: string } }) =>
        newRelationshipRegisterTei.programId);
    const programId = propsProgramId || reduxProgramId;

    const inheritedAttributeIds = useMemo(() => {
        const attributeIds = new Set<string>();

        if (programId) {
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            if (program instanceof TrackerProgram) {
                program.attributes.forEach((attribute) => {
                    if (attribute.inherit) {
                        attributeIds.add(attribute.id);
                    }
                });
            }
            return attributeIds;
        }

        const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
        trackedEntityType.attributes.forEach((attribute) => {
            if (attribute.inherit) {
                attributeIds.add(attribute.id);
            }
        });
        return attributeIds;
    }, [programId, trackedEntityTypeId]);

    const { data, isLoading } = useApiDataQuery(
        ['inheritedAttributeValues', teiId, programId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                fields: ['attributes'],
                program: programId,
            },
        }, {
            enabled: !!teiId,
            select: (response: { attributes?: Array<{ attribute: string }> }) => {
                const attributes = response.attributes || [];
                return attributes
                    .filter(attribute => inheritedAttributeIds.has(attribute.attribute));
            },
        });

    return {
        inheritedAttributes: data ?? [],
        isLoading,
    };
};
