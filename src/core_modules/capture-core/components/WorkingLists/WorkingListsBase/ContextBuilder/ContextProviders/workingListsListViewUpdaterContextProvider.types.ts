import type { ReactNode } from 'react';
import type {
    CancelUpdateList,
} from '../../workingListsBase.types';

export type Props = Readonly<{
    rowsPerPage?: number;
    currentPage?: number;
    onCancelUpdateList?: CancelUpdateList;
    customUpdateTrigger?: any;
    forceUpdateOnMount?: boolean;
    dirtyList: boolean;
    children: ReactNode;
    loadedOrgUnitId?: string;
}>;
