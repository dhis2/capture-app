// @flow
import type { FiltersData } from '../../WorkingListsBase';
import type { InitialViewConfig } from '../../WorkingListsCommon';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsColumnSetupOutputProps } from '../ColumnSetup';

type ExtractedProps = {|
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    initialViewConfig?: InitialViewConfig,
    defaultColumns: EventWorkingListsColumnConfigs,
|};

// had to add initialViewConfig as a non optional type or else it would not be removed. Also, if initialViewConfig is
// added as non optional to the ExtractedProps only (and not to EventWorkingListsReduxOutputProps),
// flow complaints about one them being optional.
type RestProps = $Rest<EventWorkingListsColumnSetupOutputProps & {| initialViewConfig: InitialViewConfig |},
    ExtractedProps & {| initialViewConfig: InitialViewConfig |}>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type CurrentViewChangesResolverOutputProps = {|
    ...RestProps,
    filters?: FiltersData,
    columns: EventWorkingListsColumnConfigs,
    sortById?: string,
    sortByDirection?: string,
    currentViewHasTemplateChanges?: boolean,
|};
