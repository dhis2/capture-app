import { useSelector, shallowEqual } from 'react-redux';

const useList = (storeId: string) => {
    const listState = useSelector(({ workingLists, workingListsListRecords, workingListsColumnsOrder }: any) => ({
        eventRecords: workingListsListRecords[storeId],
        recordsOrder: workingLists[storeId] && workingLists[storeId].order,
        customColumnOrder: workingListsColumnsOrder[storeId],
    }), shallowEqual);

    return {
        ...listState,
    };
};

export const useWorkingListsCommonStateManagementOffline = (storeId: string) =>
    useList(storeId);
