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
    const { relationshipTypes, isError } = useTEIRelationshipsWidgetMetadata();

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
                programId={programId}
                trackedEntityTypeId={trackedEntityTypeId}
                teiId={teiId}
                // $FlowFixMe - widget only needs partial URL params
                onLinkedRecordClick={onLinkedRecordClick}
                addRelationshipRenderElement={addRelationshipRenderElement}
                onOpenAddRelationship={onOpenAddRelationship}
                onCloseAddRelationship={onCloseAddRelationship}
                // optional props
                cachedRelationshipTypes={relationshipTypes}
            />
        </>
    );
};
