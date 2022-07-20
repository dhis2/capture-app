// @flow
import type {
    CancelUpdateList,
} from '../../workingListsBase.types';

export type Props = $ReadOnly<{|
    rowsPerPage?: number,
    currentPage?: number,
    onCancelUpdateList?: CancelUpdateList,
    customUpdateTrigger?: any,
    forceUpdateOnMount?: boolean,
    dirtyList: boolean,
    children: React$Node,
    loadedOrgUnitId?: string,
|}>;
