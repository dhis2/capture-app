// flow
import React, { useContext } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
} from '@dhis2/ui';
import { ResultsPageSizeContext } from '../../shared-contexts';

export const SearchFallbackButtonComponent = (
    { startFallbackSearch, currentSearchScopeId, currentFormId },
) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const handleFallbackSearch = () => {
        startFallbackSearch({
            programId: currentSearchScopeId,
            formId: currentFormId,
            resultsPageSize,
        });
    };

    return (<div>
        <p>{i18n.t('No result found')}</p>
        <Button
            onClick={handleFallbackSearch}
            dataTest="fallback-search-button"
        >
            {i18n.t('Search in all programs')}
        </Button>
    </div>);
};
