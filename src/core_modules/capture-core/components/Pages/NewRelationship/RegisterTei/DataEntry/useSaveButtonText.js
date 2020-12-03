import { useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { DATA_ENTRY_ID } from '../registerTei.const';

export const useSaveButtonText = trackedEntityTypeName =>
    useSelector(({ dataEntriesSearchGroupsResults, dataEntries }) => {
        const dataEntryKey = getDataEntryKey(DATA_ENTRY_ID, dataEntries[DATA_ENTRY_ID].itemId);

        const duplicatesFound = Boolean(
            dataEntriesSearchGroupsResults[dataEntryKey] &&
      dataEntriesSearchGroupsResults[dataEntryKey].main &&
      dataEntriesSearchGroupsResults[dataEntryKey].main.count,
        );

        const trackedEntityTypeNameLC = trackedEntityTypeName.toLocaleLowerCase();
        return duplicatesFound ?
            i18n.t('Review Duplicates') :
            i18n.t('Save new {{trackedEntityTypeName}} and link', { trackedEntityTypeName: trackedEntityTypeNameLC });
    });
