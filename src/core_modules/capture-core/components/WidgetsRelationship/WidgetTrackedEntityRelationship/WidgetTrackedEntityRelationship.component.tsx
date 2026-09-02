import React, { useMemo } from 'react';
import type { WidgetTrackedEntityRelationshipProps } from './WidgetTrackedEntityRelationship.types';
import { RelationshipsWidget } from '../common/RelationshipsWidget';
import { RelationshipSearchEntities, useRelationships } from '../common/useRelationships';
import { NewTrackedEntityRelationship } from './NewTrackedEntityRelationship';
import { useTrackedEntityTypeName } from './hooks/useTrackedEntityTypeName';
import { useRelationshipTypes } from '../common/RelationshipsWidget/useRelationshipTypes';
import { useTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

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
    readOnly,
    hideButton,
    accessReadOnly,
    hideReadOnlyBadge,
}: WidgetTrackedEntityRelationshipProps) => {
    const { data: relationshipTypes } = useRelationshipTypes(cachedRelationshipTypes);
    const { data: trackedEntityTypeName, isLoading: isLoadingTEType } = useTrackedEntityTypeName(trackedEntityTypeId);
    const relationshipLabel = useTermLabel('relationship', { programId });
    const {
        data: relationships,
        isError,
        isInitialLoading: isLoadingRelationships,
    } = useRelationships({
        entityId: teiId,
        searchMode: RelationshipSearchEntities.TRACKED_ENTITY,
        relationshipTypes: relationshipTypes || null,
    });

    const isLoading = useMemo(() => isLoadingRelationships || isLoadingTEType,
        [isLoadingRelationships, isLoadingTEType],
    );

    if (isError) {
        return (
            <div>
                {tCustomTerm(
                    'Something went wrong while loading {{relationshipLabel}}. Please try again later.',
                    { relationshipLabel },
                )}
            </div>
        );
    }

    if (!relationshipTypes?.length) {
        return null;
    }

    return (
        <RelationshipsWidget
            title={tCustomTerm('{{trackedEntityTypeName}} {{relationshipLabel}}', {
                trackedEntityTypeName,
                relationshipLabel,
                interpolation: { escapeValue: false },
            })}
            isLoading={isLoading}
            relationships={relationships}
            relationshipTypes={relationshipTypes}
            sourceId={teiId}
            onLinkedRecordClick={onLinkedRecordClick}
            readOnly={readOnly}
            accessReadOnly={accessReadOnly}
            hideReadOnlyBadge={hideReadOnlyBadge}
            trackedEntityName={trackedEntityTypeName}
        >
            <NewTrackedEntityRelationship
                teiId={teiId}
                renderElement={addRelationshipRenderElement}
                trackedEntityTypeName={trackedEntityTypeName}
                relationshipTypes={relationshipTypes}
                trackedEntityTypeId={trackedEntityTypeId}
                programId={programId}
                orgUnitId={orgUnitId}
                onOpenAddRelationship={onOpenAddRelationship}
                onCloseAddRelationship={onCloseAddRelationship}
                onSelectFindMode={onSelectFindMode}
                renderTrackedEntitySearch={renderTrackedEntitySearch}
                renderTrackedEntityRegistration={renderTrackedEntityRegistration}
                readOnly={readOnly}
                hideButton={hideButton}
            />
        </RelationshipsWidget>
    );
};
