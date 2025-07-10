import React from 'react';

import { useApplicableTypesAndSides } from './useApplicableTypesAndSides';
import { LinkedEntityMetadataSelector } from '../../../common/LinkedEntityMetadataSelector';
import type { Props } from './linkedEntityMetadataSelector.types';

export const LinkedEntityMetadataSelectorFromTrackedEntity = ({
    relationshipTypes,
    trackedEntityTypeId,
    programId,
    onSelectLinkedEntityMetadata,
}: Props) => {
    const applicableTypesInfo = useApplicableTypesAndSides(relationshipTypes, trackedEntityTypeId, [programId]);

    const LinkedEntityMetadataSelectorCommon = LinkedEntityMetadataSelector;

    return (
        <LinkedEntityMetadataSelectorCommon
            applicableTypesInfo={applicableTypesInfo}
            onSelectLinkedEntityMetadata={onSelectLinkedEntityMetadata}
        />
    );
};
