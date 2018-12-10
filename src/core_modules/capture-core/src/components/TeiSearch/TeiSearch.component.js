// @flow
import * as React from 'react';
import SearchGroup from '../../metaData/SearchGroup/SearchGroup';
import {
    getSearchGroupsByProgram,
    getSearchGroupsByTrackedEntityType,
} from './getSearchGroups';
import TeiSearchForm from './TeiSearchForm/TeiSearchForm.component';
import TeiSearchResults from './TeiSearchResults/TeiSearchResults.container';

type Props = {
    id: string,
    programId?: ?string,
    trackedEntityTypeId: string,
    onSearch: Function,
    showResults?: ?boolean,
}

const getFormId = (searchId: string, formId: string) => `${searchId}-${formId}`;

class TeiSearch extends React.Component<Props> {
    getSearchGroups = () => {
        const { programId, trackedEntityTypeId } = this.props;
        return programId ? getSearchGroupsByProgram(programId) : getSearchGroupsByTrackedEntityType(trackedEntityTypeId);
    }

    handleSearch = (formId: string, itemId: string) => {
        const { trackedEntityTypeId, programId, id } = this.props;
        this.props.onSearch(formId, itemId, id, trackedEntityTypeId, programId);
    }

    renderSearchGroups = (searchGroups: Array<SearchGroup>) => searchGroups.map((sg, i) => {
        const itemId = i.toString();
        const formId = getFormId(this.props.id, itemId);
        return (
            <TeiSearchForm
                key={formId}
                id={formId}
                itemId={itemId}
                searchForm={sg.searchForm}
                onSearch={this.handleSearch}
            />
        );
    })
    renderSearchResult = () => {
        const { onSearch, showResults, ...passOnProps } = this.props;
        return (
            <TeiSearchResults
                {...passOnProps}
            />
        );
    }

    render() {
        const searchGroups = this.getSearchGroups();

        if (this.props.showResults) {
            return this.renderSearchResult();
        }

        return searchGroups ? this.renderSearchGroups(searchGroups) : (<div />);
    }
}

export default TeiSearch;
