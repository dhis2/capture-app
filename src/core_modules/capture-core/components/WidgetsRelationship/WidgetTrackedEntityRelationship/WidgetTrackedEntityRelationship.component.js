// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { WidgetTrackedEntityRelationshipProps } from './WidgetTrackedEntityRelationship.types';
import { RelationshipsWidget } from '../common/RelationshipsWidget';
import { RelationshipSearchEntities, useRelationships } from '../common/useRelationships';
import { NewTrackedEntityRelationship } from './NewTrackedEntityRelationship';

export const WidgetTrackedEntityRelationship = ({
    relationshipTypes: cachedRelationshipTypes,
    teiId,
    trackedEntityTypeId,
    programId,
    addRelationshipRenderElement,
    onLinkedRecordClick,
    onOpenAddRelationship,
    onCloseAddRelationship,
    onSelectFindMode,
    renderTrackedEntitySearch,
}: WidgetTrackedEntityRelationshipProps) => {
    const { data: relationships, isError } = useRelationships(teiId, RelationshipSearchEntities.TRACKED_ENTITY);

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
            relationships={relationships}
            cachedRelationshipTypes={cachedRelationshipTypes}
            sourceId={teiId}
            onLinkedRecordClick={onLinkedRecordClick}
        >
            {
                relationshipTypes => (
                    <NewTrackedEntityRelationship
                        teiId={teiId}
                        renderElement={addRelationshipRenderElement}
                        relationshipTypes={relationshipTypes}
                        trackedEntityTypeId={trackedEntityTypeId}
                        programId={programId}
                        onOpenAddRelationship={onOpenAddRelationship}
                        onCloseAddRelationship={onCloseAddRelationship}
                        onSelectFindMode={onSelectFindMode}
                        renderTrackedEntitySearch={renderTrackedEntitySearch}
                    />
                )
            }
        </RelationshipsWidget>
    );
};
