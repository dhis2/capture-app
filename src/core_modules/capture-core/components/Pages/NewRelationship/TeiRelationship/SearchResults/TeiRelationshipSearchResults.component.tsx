import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { TeiSearchResults } from '../../../../TeiSearch/TeiSearchResults/TeiSearchResults.component';

type Props = {
    trackedEntityTypeName: string;
    onAddRelationship: (teiId: string, values: any) => void;
};

export const TeiRelationshipSearchResults = ({ trackedEntityTypeName, onAddRelationship, ...passOnProps }: Props) => (
    <TeiSearchResults
        {...passOnProps}
        getCustomEndElements={(teiId: string, values: any) => (
            <Button
                small
                onClick={() => onAddRelationship(teiId, values)}
            >
                {i18n.t('Link')}
            </Button>
        )}
        noResultsText={i18n.t('No {{trackedEntityTypeName}} found', { trackedEntityTypeName })}
    />
);
