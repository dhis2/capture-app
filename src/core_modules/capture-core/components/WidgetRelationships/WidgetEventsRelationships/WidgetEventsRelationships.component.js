// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useLinkedEntityGroups } from '../hooks/useLinkedEntityGroups';
import { RelationshipsWidget } from '../RelationshipsComponent';
import type { Props } from './types';

export const WidgetEventsRelationships = ({ eventId, relationships, relationshipTypes, ...passOnProps }: Props) => {
    const { relationships: eventsRelationships } = useLinkedEntityGroups(eventId, relationshipTypes, relationships);

    return (
        <RelationshipsWidget
            title={i18n.t("Event's Relationships")}
            relationships={eventsRelationships}
            {...passOnProps}
        />
    );
};
