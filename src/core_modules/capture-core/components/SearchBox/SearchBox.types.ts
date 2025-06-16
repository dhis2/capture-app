import type { RenderFoundation } from '../../metaData';

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
};

export type ComponentProps = Readonly<{
    cleanSearchRelatedInfo: () => void;
    showInitialSearchBox: () => void;
    navigateToRegisterTrackedEntity: () => void;
    trackedEntityTypeId: string;
    preselectedProgramId: SelectedSearchScopeId;
    minAttributesRequiredToSearch: number;
    searchableFields: Array<Record<string, unknown>>;
    searchStatus: string;
    ready: boolean;
}>;

export type Props = ComponentProps;
