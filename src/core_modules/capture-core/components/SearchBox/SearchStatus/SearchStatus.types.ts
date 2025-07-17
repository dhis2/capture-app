import type { AvailableSearchOption } from '../SearchBox.types';
import type { CurrentSearchTerms } from '../SearchForm/SearchForm.types';

export type ContainerProps = Readonly<{
    showInitialSearchBox: () => void;
    navigateToRegisterTrackedEntity: (currentSearchTerms: CurrentSearchTerms) => void;
    minAttributesRequiredToSearch: number;
    searchableFields: Array<Record<string, unknown>>;
    searchStatus: string;
    trackedEntityName: string;
    availableSearchOption: AvailableSearchOption | null | undefined;
}>;

export type ComponentProps = Readonly<{
    uniqueTEAName?: string;
    currentSearchTerms: Array<Record<string, unknown>>;
}> & ContainerProps;
