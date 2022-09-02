// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useLinkedEntityGroups } from '../hooks/useLinkedEntityGroups';
import { RelationshipsWidget } from '../RelationshipsComponent';
import type { Props } from './types';

export const WidgetTeisRelationships = ({ relationships, relationshipTypes, teiId, ...passOnProps }: Props) => {
    const { relationships: teiRelationships } = useLinkedEntityGroups(teiId, relationshipTypes, relationships);

    return (
        <RelationshipsWidget
            title={i18n.t("TEI's Relationships")}
            relationships={teiRelationships}
            {...passOnProps}
        />
    );
};
