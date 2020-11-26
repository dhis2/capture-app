// @flow
import type {
    ColumnConfigs,
    LoadView,
    UpdateList,
    CancelLoadView,
    Categories,
    LoadedViewContext,
} from '../../workingLists.types';
import type {
    FiltersData,
} from '../../../../../ListView';

export type Props = $ReadOnly<{|
    sortById?: string,
    sortByDirection?: string,
    filters?: FiltersData,
    columns: ColumnConfigs,
    loading: boolean,
    onLoadView: LoadView,
    loadViewError?: string,
    onUpdateList: UpdateList,
    onCancelLoadView?: CancelLoadView,
    orgUnitId: string,
    categories?: Categories,
    dirtyView: boolean,
    loadedViewContext: LoadedViewContext,
    viewPreloaded?: boolean,
    children: React$Node,
|}>;
