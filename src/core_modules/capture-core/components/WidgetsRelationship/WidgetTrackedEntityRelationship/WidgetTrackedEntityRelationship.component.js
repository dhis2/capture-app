// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetTrackedEntityRelationship.types';
import { useLinkedEntityGroups } from '../common/hooks';
import { RelationshipsWidget } from '../common/RelationshipsComponent';
import { RelationshipSearchEntities, useRelationships } from '../common/hooks/useRelationships';
import { useRelationshipTypes } from '../common/hooks/useRelationshipTypes';

export const WidgetTrackedEntityRelationship = ({
    cachedRelationshipTypes,
    trackedEntityTypeId,
    teiId,
    ...passOnProps
}: Props) => {
    const { data: relationshipTypes } = useRelationshipTypes(cachedRelationshipTypes);
    const { data: relationships, isError } = useRelationships(teiId, RelationshipSearchEntities.TRACKED_ENTITY);

    // TODO: Refactor this to be self contained
    const { relationships: linkedEntityRelationships } = useLinkedEntityGroups(teiId, relationshipTypes, relationships);

    if (isError) {
        return (
            <div>
                {i18n.t('Something went wrong while loading relationships. Please try again later.')}
            </div>
        );
    }

    return (
        <RelationshipsWidget
            title={i18n.t("TEI's Relationships")}
            relationshipTypes={relationshipTypes}
            relationships={linkedEntityRelationships}
            trackedEntityTypeId={trackedEntityTypeId}
            teiId={teiId}
            {...passOnProps}
        />
    );
};
