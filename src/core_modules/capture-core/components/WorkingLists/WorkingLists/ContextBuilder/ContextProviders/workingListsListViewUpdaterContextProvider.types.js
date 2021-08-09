// @flow
import type {
    CancelUpdateList,
} from '../../../WorkingLists/workingLists.types';

export type Props = $ReadOnly<{|
    rowsPerPage?: number,
    currentPage?: number,
    onCancelUpdateList?: CancelUpdateList,
    customUpdateTrigger?: any,
    forceUpdateOnMount?: boolean,
    dirtyList: boolean,
    children: React$Node,
|}>;
