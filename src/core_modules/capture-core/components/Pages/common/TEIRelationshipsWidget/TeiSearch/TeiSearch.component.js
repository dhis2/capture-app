// @flow
import React, { type ComponentType, useCallback, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { TeiSearchForm } from './TeiSearchForm/TeiSearchForm.container';
import { TeiSearchResults } from './TeiSearchResults/TeiSearchResults.container';
import { SearchProgramSelector } from './SearchProgramSelector/SearchProgramSelector.container';
import { Section, SectionHeaderSimple } from '../../../../Section';
import { ResultsPageSizeContext } from '../../../shared-contexts';
import type { Props } from './TeiSearch.types';

const getStyles = (theme: Theme) => ({
    container: {
        margin: theme.typography.pxToRem(10),
    },
    programSection: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(900),
        marginBottom: theme.typography.pxToRem(20),
    },
    formContainerSection: {
        maxWidth: theme.typography.pxToRem(900),
        marginBottom: theme.typography.pxToRem(20),
    },
});

const TeiSearchPlain = (props) => {
    const [programSectionOpen, setProgramSectionOpen] = useState(true);

    const getFormId = useCallback((searchGroupId) => {
        const contextId = props.selectedProgramId || props.selectedTrackedEntityTypeId || '';
        return `${props.id}-${contextId}-${searchGroupId}`;
    }, [props.selectedProgramId, props.selectedTrackedEntityTypeId, props.id]);

    const handleSearch = (formId, searchGroupId) => {
        props.onSearch(formId, searchGroupId, props.id);
    };

    const handleSearchResultsChangePage = (pageNumber) => {
        props.onSearchResultsChangePage(props.id, pageNumber);
    };

    const handleNewSearch = () => {
        props.onNewSearch(props.id);
    };

    const handleEditSearch = () => {
        props.onEditSearch(props.id);
    };

    const handleSearchValidationFailed = (...args) => {
        props.onSearchValidationFailed(...args, props.id);
    };

    const renderSearchForms = searchGroups => (
        <div className={props.classes.container}>
            {renderProgramSection()}
            {renderSearchGroups(searchGroups)}
        </div>
    );

    const renderProgramSection = () => {
        const isCollapsed = !programSectionOpen;
        return (
            <Section
                className={props.classes.programSection}
                isCollapsed={isCollapsed}
                header={
                    <SectionHeaderSimple
                        containerStyle={{ borderBottom: '1px solid #ECEFF1' }}
                        isCollapsed={isCollapsed}
                        onChangeCollapseState={() => { setProgramSectionOpen(!isCollapsed); }}
                        title={i18n.t('Program')}
                    />
                }
            >
                <SearchProgramSelector
                    searchId={props.id}
                    selectedProgramId={props.selectedProgramId}
                    selectedTrackedEntityTypeId={props.selectedTrackedEntityTypeId}
                />
            </Section>
        );
    };

    const onChangeSectionCollapseState = (id) => {
        if (props.openSearchGroupSection === id) {
            props.onSetOpenSearchGroupSection(props.id, null);
            return;
        }
        props.onSetOpenSearchGroupSection(props.id, id);
    };

    const renderSearchGroups = searchGroups => searchGroups.map((sg, i) => {
        const searchGroupId = i.toString();
        const formId = getFormId(searchGroupId);
        const header = sg.unique ? i18n.t('Search {{uniqueAttrName}}', { uniqueAttrName: sg.searchForm.getElements()[0].formName }) : i18n.t('Search by attributes');
        const collapsed = props.openSearchGroupSection !== searchGroupId;
        return (
            <Section
                data-test="search-by-attributes-forms"
                key={formId}
                isCollapsed={collapsed}
                className={props.classes.formContainerSection}
                header={
                    <SectionHeaderSimple
                        containerStyle={{ borderBottom: '1px solid #ECEFF1' }}
                        onChangeCollapseState={() => { onChangeSectionCollapseState(searchGroupId); }}
                        isCollapsed={collapsed}
                        title={header}
                    />
                }
            >
                <TeiSearchForm
                    id={formId}
                    searchId={props.id}
                    searchGroupId={searchGroupId}
                    searchGroup={sg}
                    onSearch={handleSearch}
                    onSearchValidationFailed={handleSearchValidationFailed}
                />
            </Section>
        );
    });

    const renderSearchResult = () => {
        const {
            id,
            searchGroups,
            getResultsView,
            selectedProgramId,
            selectedTrackedEntityTypeId,
            trackedEntityTypeName,
        } = props;

        return (
            <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
                <TeiSearchResults
                    id={id}
                    onChangePage={handleSearchResultsChangePage}
                    onNewSearch={handleNewSearch}
                    onEditSearch={handleEditSearch}
                    getResultsView={getResultsView}
                    searchGroups={searchGroups}
                    selectedProgramId={selectedProgramId}
                    selectedTrackedEntityTypeId={selectedTrackedEntityTypeId}
                    trackedEntityTypeName={trackedEntityTypeName}
                />
            </ResultsPageSizeContext.Provider>
        );
    };

    const searchGroups = props.searchGroups;

    if (props.showResults) {
        return renderSearchResult();
    }

    return searchGroups ? renderSearchForms(searchGroups) : (<div />);
};

export const TeiSearchComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(TeiSearchPlain);
