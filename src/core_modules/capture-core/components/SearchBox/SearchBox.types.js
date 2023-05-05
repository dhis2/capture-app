// @flow
import type { RenderFoundation } from '../../metaData';

export type SearchGroups = Array<{|
    +searchForm: RenderFoundation,
    +unique: boolean,
    +formId: string,
    +searchScope: string,
    +minAttributesRequiredToSearch: number,
|}>;

export type SelectedSearchScopeId = ?string;

export type AvailableSearchOption = {|
    +searchOptionId: string,
    +searchOptionName: string,
    +TETypeName: ?string,
    +searchGroups: SearchGroups,
|};

export type ContainerProps = $ReadOnly<{|
    dispatchNavigateToMainPage?: () => void
|}>;

export type ComponentProps = $ReadOnly<{|
    cleanSearchRelatedInfo: () => void,
    navigateToMainPage?: () => void,
    showInitialSearchBox: () => void,
    navigateToRegisterTrackedEntity: () => void,
    trackedEntityTypeId: string,
    preselectedProgramId: SelectedSearchScopeId,
    minAttributesRequiredToSearch: number,
    searchableFields: Array<Object>,
    searchStatus: string,
    error: boolean,
    ready: boolean,
|}>;

export type Props = {|
    ...CssClasses,
    ...ComponentProps,
|};
