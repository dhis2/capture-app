import {
    getFilterSearchGroupForSearchEpic,
    getExecuteSearchForSearchGroupEpic,
} from 'capture-core/components/DataEntry';
import { enrollmentBatchActionTypes, enrollmentOpenBatchActionTypes } from 'capture-core/components/DataEntries';

export default () => [
    getFilterSearchGroupForSearchEpic([enrollmentBatchActionTypes.RULES_EXECUTED_POST_UPDATE_FIELD_FOR_ENROLLMENT]),
    getExecuteSearchForSearchGroupEpic([enrollmentOpenBatchActionTypes.OPEN_DATA_ENYRY_FOR_NEW_ENROLLMENT_BATCH]),
];
