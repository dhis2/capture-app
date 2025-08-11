import type { SearchGroup } from '../../metaData';

type PropsFromRedux = {
    searchGroups?: Array<SearchGroup>;
    showResults?: boolean;
    selectedProgramId?: string;
    selectedTrackedEntityTypeId?: string;
    openSearchGroupSection?: string;
};

type DispatchersFromRedux = {
    onSearch: any;
    onSearchValidationFailed: any;
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId?: string) => void;
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => void;
    onNewSearch: (searchId: string) => void;
    onEditSearch: (searchId: string) => void;
};

export type OwnProps = {
    id: string;
    getResultsView: any;
    resultsPageSize: number;
};

export type Props = OwnProps & DispatchersFromRedux & PropsFromRedux & any;
