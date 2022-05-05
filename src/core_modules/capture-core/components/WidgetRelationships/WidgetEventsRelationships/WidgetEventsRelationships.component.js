// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useLinkedEntityGroups } from '../hooks/useLinkedEntityGroups';
import { RelationshipsWidget } from '../RelationshipsComponent';
import type { InputRelationship, RelationshipType } from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

type Props = {|
    eventId: string,
    relationships: Array<InputRelationship>,
    relationshipsTypes: Array<RelationshipType>,
    onAddRelationship: () => void
|}

export const WidgetEventsRelationships = ({ eventId, relationships, relationshipsTypes, onAddRelationship }: Props) => {
    const { relationships: eventsRelationships } = useLinkedEntityGroups(eventId, relationshipsTypes, relationships);

    return (
        <RelationshipsWidget
            title={i18n.t("Event's Relationships")}
            relationships={eventsRelationships}
            onAddRelationship={onAddRelationship}
        />
    );
};
