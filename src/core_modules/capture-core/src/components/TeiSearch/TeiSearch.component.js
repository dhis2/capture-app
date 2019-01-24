// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import SearchGroup from '../../metaData/SearchGroup/SearchGroup';
import TeiSearchForm from './TeiSearchForm/TeiSearchForm.container';
import TeiSearchResults from './TeiSearchResults/TeiSearchResults.container';
import SearchOrgUnitSelector from './SearchOrgUnitSelector/SearchOrgUnitSelector.container';
import SearchProgramSelector from './SearchProgramSelector/SearchProgramSelector.container';
import { Section } from '../Section';

type Props = {
    id: string,
    selectedTrackedEntityTypeId: ?string,
    selectedProgramId: ?string,
    searchGroups: ?Array<SearchGroup>,
    onSearch: Function,
    onSearchValidationFailed: Function,
    showResults?: ?boolean,
    onNewSearch: (searchId: string) => void,
    onEditSearch: (searchId: string) => void,
    classes: {
        section: string,
        formContainerSection: string,
        programSection: string,
    },
}

const getStyles = (theme: Theme) => ({
    programSection: {
        backgroundColor: 'white',
        padding: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(900),
        marginBottom: theme.typography.pxToRem(20),
    },
    formContainerSection: {
        maxWidth: theme.typography.pxToRem(900),
        padding: theme.typography.pxToRem(10),
        marginBottom: theme.typography.pxToRem(20),
        backgroundColor: theme.palette.grey.lightest,
    },
});

class TeiSearch extends React.Component<Props> {
    getFormId = (searchGroupId: string) => {
        const contextId = this.props.selectedProgramId || this.props.selectedTrackedEntityTypeId || '';
        return `${this.props.id}-${contextId}-${searchGroupId}`;
    }

    handleSearch = (formId: string, searchGroupId: string) => {
        const { id } = this.props;
        this.props.onSearch(formId, searchGroupId, id);
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
        <div>
            <Section className={this.props.classes.programSection}>
                <SearchProgramSelector searchId={this.props.id} />
            </Section>
            {this.renderSearchGroups(searchGroups)}
        </div>
    );

    renderSearchGroups = (searchGroups: Array<SearchGroup>) => searchGroups.map((sg, i) => {
        const searchGroupId = i.toString();
        const formId = this.getFormId(searchGroupId);
        return (
            <Section className={this.props.classes.formContainerSection}>
                <TeiSearchForm
                    key={formId}
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
        const { onSearch, showResults, onNewSearch, onEditSearch, classes, ...passOnProps } = this.props;
        return (
            <TeiSearchResults
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
