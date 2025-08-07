import type { ReactElement } from 'react';
import type { TrackerWorkingListsReduxOutputProps } from '../ReduxProvider';
import type { UpdateList } from '../../WorkingListsCommon';
import type { LoadTeiView } from '../types';

type ExtractedProps = Readonly<{
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList,
    storeId: string,
}>;

type RestProps = Omit<TrackerWorkingListsReduxOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type TrackerWorkingListsViewMenuSetupOutputProps = RestProps & {
    onLoadView: LoadTeiView,
    onUpdateList: UpdateList
    customUpdateTrigger?: string,
    allRowsAreSelected: boolean,
    selectedRows: { [key: string]: boolean },
    onRowSelect: (id: string) => void,
    onSelectAll: (rows: string[]) => void,
    selectionInProgress: boolean,
    bulkActionBarComponent: ReactElement<any>,
};

