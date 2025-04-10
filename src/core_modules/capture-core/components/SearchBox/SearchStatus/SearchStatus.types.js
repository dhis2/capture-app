// @flow
import type { AvailableSearchOption } from '../SearchBox.types';

export type ContainerProps = $ReadOnly<{|
    showInitialSearchBox: () => void,
    navigateToRegisterTrackedEntity: (currentSearchTerms: Array<Object>) => void,
    minAttributesRequiredToSearch: number,
    searchableFields: Array<Object>,
    searchStatus: string,
    trackedEntityName: string,
    availableSearchOption: ?AvailableSearchOption,
|}>;

export type ComponentProps = $ReadOnly<{|
    ...ContainerProps,
    uniqueTEAName?: string,
    currentSearchTerms: Array<Object>,
|}>;

export type Props = {|
    ...CssClasses,
    ...ContainerProps,
|};
