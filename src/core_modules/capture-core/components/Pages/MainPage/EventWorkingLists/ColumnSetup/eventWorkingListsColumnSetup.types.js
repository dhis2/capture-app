// @flow
import type { EventProgram } from '../../../../../metaData';
import type { EventWorkingListsReduxOutputProps } from '../ReduxProvider';
import type { ColumnConfigs, LoadView, UpdateList } from '../../WorkingLists';
import type { CustomColumnOrder } from '../types';

type ExtractedProps = {|
    program: EventProgram,
    customColumnOrder?: CustomColumnOrder,
    onLoadView: Function,
    onUpdateList: Function,
|};

// had to add customColumnOrder as a non optional type or else it would not be removed. Also, if customColumnOrder is
// added as non optional to the ExtractedProps only (and not to EventWorkingListsReduxOutputProps),
// flow complaints about one them being optional.
type RestProps =$Rest<EventWorkingListsReduxOutputProps & { customColumnOrder: CustomColumnOrder },
    ExtractedProps & { customColumnOrder: CustomColumnOrder }>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsColumnSetupOutputProps = {|
    ...RestProps,
    program: EventProgram,
    columns: ColumnConfigs,
    defaultColumns: ColumnConfigs,
    onCheckSkipReload: Function,
    onLoadView: LoadView,
    onUpdateList: UpdateList,
|};
