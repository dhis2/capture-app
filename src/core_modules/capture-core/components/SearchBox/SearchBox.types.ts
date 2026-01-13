import type { RenderFoundation } from '../../metaData';
import type { CurrentSearchTerms } from './SearchForm/SearchForm.types';
import type { SearchAttribute } from '../../metaDataMemoryStoreBuilders/common/factory/searchGroup';

export type SearchGroups = Array<{
    searchForm: RenderFoundation;
    unique: boolean;
    formId: string;
    searchScope: string;
    minAttributesRequiredToSearch: number;
    unsupportedAttributes?: SearchAttribute[];
}>;

export type SelectedSearchScopeId = string | null | undefined;

export type AvailableSearchOption = {
    searchOptionId: string;
    searchOptionName: string;
    TETypeName?: string;
    searchGroups: SearchGroups;
};

export type ComponentProps = Readonly<{
    cleanSearchRelatedInfo: () => void;
    showInitialSearchBox: () => void;
    navigateToRegisterTrackedEntity: (currentSearchTerms: CurrentSearchTerms) => void;
    trackedEntityTypeId: string;
    preselectedProgramId: SelectedSearchScopeId;
    minAttributesRequiredToSearch: number;
    searchableFields: Array<Record<string, unknown>>;
    searchStatus: string;
    ready: boolean;
}>;

export type Props = ComponentProps;
