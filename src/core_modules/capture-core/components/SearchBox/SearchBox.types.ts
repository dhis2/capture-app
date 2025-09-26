import type { RenderFoundation } from '../../metaData';
import type { CurrentSearchTerms } from './SearchForm/SearchForm.types';

export type SearchGroups = Array<{
    searchForm: RenderFoundation;
    unique: boolean;
    formId: string;
    searchScope: string;
    minAttributesRequiredToSearch: number;
}>;

export type SelectedSearchScopeId = string | null | undefined;

export type AvailableSearchOption = {
    searchOptionId: string;
    searchOptionName: string;
    TETypeName?: string;
    searchGroups: SearchGroups;
    filteredUnsupportedAttributes?: Array<{ id: string; displayName: string; valueType: string }>;
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
