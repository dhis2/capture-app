import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';
import { searchScopes } from '../SearchBox.constants';
import { dataElementTypes, OptionSet } from '../../../metaData';
import type { AvailableSearchOption } from '../SearchBox.types';
import type { ListItem } from '../../CardList/CardList.types';

export type CardDataElementsInformation = Array<{
    id: string;
    name: string;
    type: typeof dataElementTypes[keyof typeof dataElementTypes];
    optionSet?: OptionSet | null;
}>;


export type CardProfileImageElementInformation = Readonly<{ id: string; name: string; type: 'IMAGE' }>;

export type PropsFromRedux = {
    currentPage: number;
    currentSearchScopeType: keyof typeof searchScopes;
    currentSearchScopeId: string;
    currentSearchScopeName: string;
    currentFormId: string;
    searchResults: Array<ListItem>;
    currentSearchTerms: CurrentSearchTerms;
    dataElements: CardDataElementsInformation;
    otherResults: Array<ListItem>;
    otherCurrentPage: number;
    orgUnitId: string;
};

export type OwnProps = {
    availableSearchOption?: AvailableSearchOption;
};

export type DispatchersFromRedux = {
    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId, page, resultsPageSize }: { trackedEntityTypeId: string; formId: string; page: number; resultsPageSize: number }) => void;
    startFallbackSearch: ({ programId, formId, resultsPageSize, page }: { programId: string; formId: string; resultsPageSize: number; page?: number }) => void;
    searchViaAttributesOnScopeProgram: ({ programId, formId, page, resultsPageSize }: { programId: string; formId: string; page: number; resultsPageSize: number }) => void;
    handleCreateNew: (currentSearchTerms: CurrentSearchTerms) => void;
};

export type Props = DispatchersFromRedux & PropsFromRedux & OwnProps;
