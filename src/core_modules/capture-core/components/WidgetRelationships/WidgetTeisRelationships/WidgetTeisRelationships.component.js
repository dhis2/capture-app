// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useTeiRelationships } from '../hooks/useTeiRelationships';
import { WidgetRelationships } from '../Relationships';
import type { WidgetTeisProps } from '../widgetRelationships.types';

export const WidgetTeisRelationships = ({ relationships, teiId, onAddRelationship }: WidgetTeisProps) => {
    const teiRelationships = useTeiRelationships(teiId, relationships);

    return (
        <WidgetRelationships
            title={i18n.t("TEI's Relationships")}
            relationships={teiRelationships}
            onAddRelationship={onAddRelationship}
        />
    );
};
