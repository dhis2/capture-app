// @flow
import type { AvailableSearchOption } from '../SearchBox.types';

export type ContainerProps = $ReadOnly<{|
    showInitialSearchBox: () => void,
    navigateToRegisterUser: () => void,
    minAttributesRequiredToSearch: number,
    searchableFields: Array<Object>,
    searchStatus: string,
    fallbackTriggered: boolean,
    availableSearchOption: AvailableSearchOption,
|}>;

export type ComponentProps = $ReadOnly<{|
    ...ContainerProps,
    uniqueTEAName?: string,
|}>;

export type Props = {|
    ...CssClasses,
    ...ContainerProps,
|};
