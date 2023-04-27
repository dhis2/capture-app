// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useTEIRelationshipsWidgetMetadata } from '../../../common/TEIRelationshipsWidget';
import { WidgetTrackedEntityRelationship } from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import type { Props } from './TrackedEntityRelationshipsWrapper.types';

export const TrackedEntityRelationshipsWrapper = ({
    trackedEntityTypeId,
    teiId,
    programId,
    addRelationshipRenderElement,
    onOpenAddRelationship,
    onCloseAddRelationship,
    onLinkedRecordClick,
}: Props) => {
    const { getPrograms, relationshipTypes, isError } = useTEIRelationshipsWidgetMetadata();

    if (isError) {
        return (
            <div>
                {i18n.t('Could not retrieve metadata. Please try again later.')}
            </div>
        );
    }

    if (!relationshipTypes || !addRelationshipRenderElement) {
        return null;
    }

    return (
        <>
            <WidgetTrackedEntityRelationship
                cachedRelationshipTypes={relationshipTypes}
                trackedEntityTypeId={trackedEntityTypeId}
                programId={programId}
                teiId={teiId}
                onLinkedRecordClick={onLinkedRecordClick}
                addRelationshipRenderElement={addRelationshipRenderElement}
                onOpenAddRelationship={onOpenAddRelationship}
                onCloseAddRelationship={onCloseAddRelationship}
                // Advanced props for metadata, at some point the Widget should work without these
                // These are callbacks so we avoid compution before the data is actually needed, the disadvantage is that these will not automatially re-render inner components if there are changes (not needed in our app)
                // We might also want to implement async versions of these (async callbacks should be called from useEffects)
                getPrograms={getPrograms}
                getSearchGroups={() => [{ unique: false, fields: [{ id: 'id1', type: 'TEXT' }] }]}
            />
        </>
    );
};
