import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import type { ComponentProps } from './SearchBox.types';
import { searchBoxStatus } from '../../reducers/descriptions/searchDomain.reducerDescription';
import { SearchForm } from './SearchForm';
import { TrackedEntityTypeSelector } from '../TrackedEntityTypeSelector';
import { SearchStatus } from './SearchStatus';
import { withLoadingIndicator } from '../../HOC';
import { useScopeInfo } from '../../hooks/useScopeInfo';

const getStyles = () => ({
    container: {
        padding: spacers.dp16,
    },
    trackedEntityTypeSelectorContainer: {
        paddingTop: spacers.dp16,
        paddingBottom: spacers.dp16,
    },
    searchFormContainer: {
        backgroundColor: colors.grey050,
        padding: spacers.dp16,
        borderRadius: '3px',
    },
});

type Props = ComponentProps & WithStyles<typeof getStyles>;

const Index = ({
    searchStatus,
    preselectedProgramId,
    cleanSearchRelatedInfo,
    showInitialSearchBox,
    navigateToRegisterTrackedEntity,
    minAttributesRequiredToSearch,
    searchableFields,
    classes,
}: Props) => {
    const [selectedSearchScopeId, setSearchScopeId] = useState(preselectedProgramId);
    const { trackedEntityName } = useScopeInfo(selectedSearchScopeId || '');

    useEffect(() => {
        cleanSearchRelatedInfo();
    }, [cleanSearchRelatedInfo]);

    useEffect(() => {
        showInitialSearchBox();
    }, [showInitialSearchBox]);

    const handleSetSearchScopeId = (searchScopeId: string) => {
        setSearchScopeId(searchScopeId);
    };


    const renderSearchForm = () => (
        <div className={classes.searchFormContainer}>
            <SearchForm
                selectedSearchScopeId={selectedSearchScopeId || ''}
                searchGroupsForSelectedScope={[]}
            />
        </div>
    );

    const renderTrackedEntityTypeSelector = () => (
        <div className={classes.trackedEntityTypeSelectorContainer}>
            <TrackedEntityTypeSelector
                onSelect={(searchScopeId) => {
                    handleSetSearchScopeId(searchScopeId);
                }}
                headerText={i18n.t('Select tracked entity type')}
                footerText={i18n.t('Select a tracked entity type to search')}
            />
        </div>
    );

    if (searchStatus && searchStatus !== searchBoxStatus.INITIAL) {
        return React.createElement(SearchStatus, {
            searchStatus,
            showInitialSearchBox,
            navigateToRegisterTrackedEntity,
            minAttributesRequiredToSearch,
            searchableFields,
            trackedEntityName,
        });
    }

    return (
        <div className={classes.container}>
            {renderTrackedEntityTypeSelector()}
            {renderSearchForm()}
        </div>
    );
};

export const SearchBoxComponent = compose(
    withLoadingIndicator(),
    withStyles(getStyles),
)(Index) as ComponentType<ComponentProps>;
