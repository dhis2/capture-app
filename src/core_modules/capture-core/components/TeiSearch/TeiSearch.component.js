// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { SearchGroup } from '../../metaData';
import TeiSearchForm from './TeiSearchForm/TeiSearchForm.container';
import TeiSearchResults from './TeiSearchResults/TeiSearchResults.container';
import SearchProgramSelector from './SearchProgramSelector/SearchProgramSelector.container';
import { Section, SectionHeaderSimple } from '../Section';

type Props = {
    id: string,
    selectedTrackedEntityTypeId: ?string,
    selectedProgramId: ?string,
    searchGroups: ?Array<SearchGroup>,
    onSearch: Function,
    onSearchValidationFailed: Function,
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId: ?string) => void,
    openSearchGroupSection: ?string,
    showResults?: ?boolean,
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => void,
    onNewSearch: (searchId: string) => void,
    onEditSearch: (searchId: string) => void,
    classes: {
        container: string,
        section: string,
        formContainerSection: string,
        programSection: string,
    },
}

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

type State = {
    programSectionOpen: boolean,
}

class TeiSearch extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { programSectionOpen: true };
    }


    getFormId = (searchGroupId: string) => {
        const contextId = this.props.selectedProgramId || this.props.selectedTrackedEntityTypeId || '';
        return `${this.props.id}-${contextId}-${searchGroupId}`;
    }

    handleSearch = (formId: string, searchGroupId: string) => {
        const { id } = this.props;
        this.props.onSearch(formId, searchGroupId, id);
    }

    handleSearchResultsChangePage = (pageNumber: number) => {
        this.props.onSearchResultsChangePage(this.props.id, pageNumber);
    }

    handleNewSearch = () => {
        this.props.onNewSearch(this.props.id);
    }

    handleEditSearch = () => {
        this.props.onEditSearch(this.props.id);
    }

    handleSearchValidationFailed = (...args) => {
        const { id } = this.props;
        this.props.onSearchValidationFailed(...args, id);
    }

    renderSearchForms = (searchGroups: Array<SearchGroup>) => (
        <div className={this.props.classes.container}>
            {this.renderProgramSection()}
            {this.renderSearchGroups(searchGroups)}
        </div>
    );

    renderProgramSection = () => {
        const isCollapsed = !this.state.programSectionOpen;
        return (
            <Section
                className={this.props.classes.programSection}
                isCollapsed={isCollapsed}
                header={
                    <SectionHeaderSimple
                        containerStyle={{ borderBottom: '1px solid #ECEFF1' }}
                        isCollapsed={isCollapsed}
                        onChangeCollapseState={() => { this.setState({ programSectionOpen: !!isCollapsed }); }}
                        title={i18n.t('Program')}
                    />
                }
            >
                <SearchProgramSelector searchId={this.props.id} />
            </Section>
        );
    }

    onChangeSectionCollapseState = (id) => {
        if (this.props.openSearchGroupSection === id) {
            this.props.onSetOpenSearchGroupSection(this.props.id, null);
            return;
        }
        this.props.onSetOpenSearchGroupSection(this.props.id, id);
    }

    renderSearchGroups = (searchGroups: Array<SearchGroup>) => searchGroups.map((sg, i) => {
        const searchGroupId = i.toString();
        const formId = this.getFormId(searchGroupId);
        const header = sg.unique ? i18n.t('Search {{uniqueAttrName}}', { uniqueAttrName: sg.searchForm.getElements()[0].formName }) : i18n.t('Search by attributes');
        const collapsed = this.props.openSearchGroupSection !== searchGroupId;
        return (
            <Section
                key={formId}
                isCollapsed={collapsed}
                className={this.props.classes.formContainerSection}
                header={
                    <SectionHeaderSimple
                        containerStyle={{ borderBottom: '1px solid #ECEFF1' }}
                        onChangeCollapseState={() => { this.onChangeSectionCollapseState(searchGroupId); }}
                        isCollapsed={collapsed}
                        title={header}
                    />}
            >
                <TeiSearchForm
                    id={formId}
                    searchId={this.props.id}
                    searchGroupId={searchGroupId}
                    searchGroup={sg}
                    onSearch={this.handleSearch}
                    onSearchValidationFailed={this.handleSearchValidationFailed}
                />
            </Section>
        );
    })
    renderSearchResult = () => {
        const { onSearch, showResults, onNewSearch, onEditSearch, onSearchResultsChangePage, classes, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TeiSearchResults
                onChangePage={this.handleSearchResultsChangePage}
                onNewSearch={this.handleNewSearch}
                onEditSearch={this.handleEditSearch}
                {...passOnProps}
            />
        );
    }

    render() {
        const searchGroups = this.props.searchGroups;

        if (this.props.showResults) {
            return this.renderSearchResult();
        }

        return searchGroups ? this.renderSearchForms(searchGroups) : (<div />);
    }
}

export default withStyles(getStyles)(TeiSearch);
