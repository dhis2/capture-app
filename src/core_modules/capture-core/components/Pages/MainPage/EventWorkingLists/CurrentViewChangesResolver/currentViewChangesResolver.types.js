// @flow
import type { FiltersData, ColumnConfigs } from '../../WorkingLists';
import type { EventWorkingListsColumnSetupOutputProps } from '../ColumnSetup';

type ExtractedProps = {|
    filters?: FiltersData,
    columns: ColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    initialViewConfig?: {
        filters?: FiltersData,
        customVisibleColumnIds?: Array<string>,
        sortById?: string,
        sortByDirection?: string,
    },
    defaultColumns: ColumnConfigs,
|};

// had to add initialViewConfig as a non optional type or else it would not be removed. Also, if initialViewConfig is
// added as non optional to the ExtractedProps only (and not to EventWorkingListsReduxOutputProps),
// flow complaints about one them being optional.
type RestProps = $Rest<EventWorkingListsColumnSetupOutputProps & {| initialViewConfig: Object |},
    ExtractedProps & {| initialViewConfig: Object |}>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type CurrentViewChangesResolverOutputProps = {|
    ...RestProps,
    filters?: FiltersData,
    columns: ColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    currentViewHasTemplateChanges?: boolean,
|};

export type CurrentViewConfig = {
    filters: FiltersData,
    columns: ColumnConfigs,
    sortById: string,
    sortByDirection: string,
};

export type InitialViewConfig = {
    filters: FiltersData,
    visibleColumnIds: Array<string>,
    sortById: string,
    sortByDirection: string,
};
