// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useRelationships } from '../hooks/useRelationships';
import { RelationshipsWidget } from '../RelationshipsComponent';
import type { InputRelationship } from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';


type Props = {|
    relationships: Array<InputRelationship>,
    onAddRelationship: () => void,
    teiId: string,
    ...CssClasses,
|};

export const WidgetTeisRelationships = ({ relationships, teiId, onAddRelationship }: Props) => {
    const { relationships: teiRelationships } = useRelationships(teiId, relationships);

    return (
        <RelationshipsWidget
            title={i18n.t("TEI's Relationships")}
            relationships={teiRelationships}
            onAddRelationship={onAddRelationship}
        />
    );
};
