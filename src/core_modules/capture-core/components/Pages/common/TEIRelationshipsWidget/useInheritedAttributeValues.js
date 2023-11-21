// @flow
import type { InputAttribute } from '../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import { getTrackedEntityTypeThrowIfNotFound } from '../../../../metaData';

type Props = {
    teiId: string,
    trackedEntityTypeId: string,
};

type Return = {
    inheritedAttributes: Array<InputAttribute>,
    isLoading: boolean,
};
export const useInheritedAttributeValues = ({ teiId, trackedEntityTypeId }: Props): Return => {
    const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
    const inheritedAttributeIds = trackedEntityType.attributes?.reduce((acc, attribute) => {
        if (attribute.inherit) {
            acc.add(attribute.id);
        }
        return acc;
    }, new Set());

    const { data, isLoading } = useApiDataQuery(
        ['inheritedAttributeValues', teiId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                fields: ['attributes'],
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
