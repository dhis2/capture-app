import type { SearchGroup } from '../../../../../metaData';
import type { FilteredAttribute } from '../../../../../utils/warnings/UnsupportedAttributesNotification';

type PropsFromRedux = {
    searchGroups: Array<SearchGroup> | null | undefined;
    filteredUnsupportedAttributes: FilteredAttribute[];
    showResults?: boolean | null | undefined;
    openSearchGroupSection: string | null | undefined;
    trackedEntityTypeName: string;
    selectedProgramId: string | null | undefined;
}

type DispatchersFromRedux = {
    onSearch: any;
    onSearchValidationFailed: any;
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId: string | null | undefined) => void;
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => void;
    onNewSearch: (searchId: string) => void;
    onEditSearch: (searchId: string) => void;
}

export type OwnProps = {
    id: string;
    getResultsView: any;
    resultsPageSize: number;
    selectedTrackedEntityTypeId: string;
}

export type Props = OwnProps & DispatchersFromRedux & PropsFromRedux;
