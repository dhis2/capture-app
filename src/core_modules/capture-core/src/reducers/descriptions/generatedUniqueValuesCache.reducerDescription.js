// @flow
import { createReducerDescription } from '../../trackerRedux';
import {
    openActionTypes as enrollmentOpenActionTypes,
} from '../../components/DataEntries/Enrollment';
import {
    openActionTypes as teiOpenActionTypes,
} from '../../components/DataEntries/TrackedEntityInstance';

export const generatedUniqueValuesCacheDesc = createReducerDescription({
    [enrollmentOpenActionTypes.DATA_ENTRY_NEW_ENROLLMENT_OPEN]: (state, action) => {
        const { dataEntryId, generatedUniqueValues } = action.payload;
        return {
            ...state,
            [dataEntryId]: {
                ...state[dataEntryId],
                ...generatedUniqueValues,
            },
        };
    },
    [teiOpenActionTypes.DATA_ENTRY_NEW_TEI_OPEN]: (state, action) => {
        const { dataEntryId, generatedUniqueValues } = action.payload;
        return {
            ...state,
            [dataEntryId]: {
                ...state[dataEntryId],
                ...generatedUniqueValues,
            },
        };
    },
}, 'generatedUniqueValuesCache');
