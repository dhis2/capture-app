import { useSelector } from 'react-redux';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';

export const usePossibleDuplicatesExist = (dataEntryId: string) => {
    const { itemId } = useSelector(({ dataEntries }: { dataEntries: any }) =>
        (dataEntries[dataEntryId] ? dataEntries[dataEntryId] : {}));
    const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
    return useSelector(({ dataEntriesSearchGroupsResults }: { dataEntriesSearchGroupsResults: any }) =>
        Boolean(
            dataEntriesSearchGroupsResults[dataEntryKey]
            && dataEntriesSearchGroupsResults[dataEntryKey].main
            && dataEntriesSearchGroupsResults[dataEntryKey].main.count,
        ),
    );
};
