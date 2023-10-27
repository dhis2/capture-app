// @flow
import React from 'react';

import { useApplicableTypesAndSides } from './useApplicableTypesAndSides';
import {
    LinkedEntityMetadataSelector,
    type LinkedEntityMetadataSelectorType,
} from '../../../common/LinkedEntityMetadataSelector';
import type { Props, Side, LinkedEntityMetadata } from './linkedEntityMetadataSelector.types';

export const LinkedEntityMetadataSelectorFromTrackedEntity = ({
    relationshipTypes,
    trackedEntityTypeId,
    programId,
    onSelectLinkedEntityMetadata,
}: Props) => {
    const applicableTypesInfo = useApplicableTypesAndSides(relationshipTypes, trackedEntityTypeId, [programId]);

    const LinkedEntityMetadataSelectorCommon: LinkedEntityMetadataSelectorType<LinkedEntityMetadata, Side> =
    LinkedEntityMetadataSelector;

    return (
        <LinkedEntityMetadataSelectorCommon
            applicableTypesInfo={applicableTypesInfo}
            onSelectLinkedEntityMetadata={onSelectLinkedEntityMetadata}
        />
    );
};
