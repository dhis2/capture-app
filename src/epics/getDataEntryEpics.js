import {
    getFilterSearchGroupForSearchEpic,
    getExecuteSearchForSearchGroupEpic,
} from 'capture-core/components/DataEntry';
import {
    enrollmentBatchActionTypes,
    enrollmentOpenBatchActionTypes,
    teiBatchActionTypes,
    teiOpenBatchActionTypes,
} from 'capture-core/components/DataEntries';

export default () => [
    getFilterSearchGroupForSearchEpic([
        enrollmentBatchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT,
        teiBatchActionTypes.NEW_TEI_FIELD_UPDATE_BATCH,
    ]),
    getExecuteSearchForSearchGroupEpic([
        enrollmentOpenBatchActionTypes.OPEN_DATA_ENYRY_FOR_NEW_ENROLLMENT_BATCH,
        teiOpenBatchActionTypes.NEW_TEI_DATA_ENTRY_OPEN_BATCH,
    ]),
];
