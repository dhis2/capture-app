import type { AvailableSearchOption } from '../SearchBox.types';

export type ContainerProps = Readonly<{
    showInitialSearchBox: () => void;
    navigateToRegisterTrackedEntity: (currentSearchTerms: any) => void;
    minAttributesRequiredToSearch: number;
    searchableFields: Array<any>;
    searchStatus: string;
    trackedEntityName: string;
    availableSearchOption?: AvailableSearchOption;
}>;

export type ComponentProps = Readonly<{
    uniqueTEAName?: string;
    currentSearchTerms: Array<any>;
} & ContainerProps>;

export type Props = ComponentProps & { classes: any };
