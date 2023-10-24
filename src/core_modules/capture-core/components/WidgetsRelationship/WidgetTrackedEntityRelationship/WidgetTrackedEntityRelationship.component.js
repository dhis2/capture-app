// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { WidgetTrackedEntityRelationshipProps } from './WidgetTrackedEntityRelationship.types';
import { RelationshipsWidget } from '../common/RelationshipsWidget';
import { RelationshipSearchEntities, useRelationships } from '../common/useRelationships';
import { NewTrackedEntityRelationship } from './NewTrackedEntityRelationship';
import { useTrackedEntityTypeName } from './hooks/useTrackedEntityTypeName';

export const WidgetTrackedEntityRelationship = ({
    relationshipTypes: cachedRelationshipTypes,
    teiId,
    trackedEntityTypeId,
    programId,
    orgUnitId,
    addRelationshipRenderElement,
    onLinkedRecordClick,
    onOpenAddRelationship,
    onCloseAddRelationship,
    onSelectFindMode,
    renderTrackedEntitySearch,
    renderTrackedEntityRegistration,
}: WidgetTrackedEntityRelationshipProps) => {
    const { data: relationships, isError, isLoading: isLoadingRelationships } = useRelationships(teiId, RelationshipSearchEntities.TRACKED_ENTITY);
    const { data: trackedEntityTypeName, isLoading: isLoadingTEType } = useTrackedEntityTypeName(trackedEntityTypeId);

    const isLoading = useMemo(() => isLoadingRelationships || isLoadingTEType,
        [isLoadingRelationships, isLoadingTEType],
    );

    if (isError) {
        return (
            <div>
                {i18n.t('Something went wrong while loading relationships. Please try again later.')}
            </div>
        );
    }

    return (
        <RelationshipsWidget
            title={i18n.t('{{trackedEntityTypeName}} relationships', {
                trackedEntityTypeName,
                interpolation: { escapeValue: false },
            })}
            isLoading={isLoading}
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
                        orgUnitId={orgUnitId}
                        onOpenAddRelationship={onOpenAddRelationship}
                        onCloseAddRelationship={onCloseAddRelationship}
                        onSelectFindMode={onSelectFindMode}
                        renderTrackedEntitySearch={renderTrackedEntitySearch}
                        renderTrackedEntityRegistration={renderTrackedEntityRegistration}
                    />
                )
            }
        </RelationshipsWidget>
    );
};
