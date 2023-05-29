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

export type ComponentProps = $ReadOnly<{|
    cleanSearchRelatedInfo: () => void,
    showInitialSearchBox: () => void,
    navigateToRegisterTrackedEntity: () => void,
    trackedEntityTypeId: string,
    preselectedProgramId: SelectedSearchScopeId,
    minAttributesRequiredToSearch: number,
    searchableFields: Array<Object>,
    searchStatus: string,
    ready: boolean,
|}>;

export type Props = {|
    ...CssClasses,
    ...ComponentProps,
|};
