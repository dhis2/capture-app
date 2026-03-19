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
    relationshipFromSideProgramId: string;
};

type Return = {
    inheritedAttributes: Array<InputAttribute>;
    isLoading: boolean;
};
export const useInheritedAttributeValues = ({
    teiId,
    trackedEntityTypeId,
    relationshipFromSideProgramId,
}: Props): Return => {
    const relationshipToSideProgramId = useSelector((state: any) => state.newRelationshipRegisterTei.programId);
    const inheritedAttributeIds = useMemo(() => {
        const attributeIds = new Set();

        if (relationshipToSideProgramId) {
            const program = getProgramFromProgramIdThrowIfNotFound(relationshipToSideProgramId);
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
    }, [relationshipToSideProgramId, trackedEntityTypeId]);


    const { data, isInitialLoading } = useApiDataQuery(
        ['inheritedAttributeValues', teiId, relationshipFromSideProgramId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                fields: ['attributes'],
                program: relationshipFromSideProgramId,
            },
        }, {
            enabled: !!teiId,
            select: (response: any) => {
                const attributes = response.attributes || [];
                return attributes
                    .filter((attribute: any) => inheritedAttributeIds.has(attribute.attribute));
            },
        }) as any;

    return {
        inheritedAttributes: data ?? [],
        isLoading: isInitialLoading,
    };
};
