import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import {
    getProgramFromProgramIdThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    TrackerProgram,
} from '../../../../metaData';

export const useInheritedAttributeValues = ({ teiId, trackedEntityTypeId }) => {
    const programId = useSelector(({ newRelationshipRegisterTei }) => newRelationshipRegisterTei.programId);
    const inheritedAttributeIds = useMemo(() => {
        const attributeIds = new Set();

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
            select: (response) => {
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
