// @flow
import { createReducerDescription } from '../../trackerRedux';
import {
    openActionTypes as enrollmentOpenActionTypes,
} from '../../components/DataEntries/Enrollment';
import {
    openActionTypes as teiOpenActionTypes,
} from '../../components/DataEntries/TrackedEntityInstance';

import {
    mainActionTypes as dataEntryActionTypes,
} from '../../components/DataEntry';

import {
    actionTypes as viewEventRelationshipsActionTypes,
} from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';

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
    [dataEntryActionTypes.ADD_DATA_ENTRY_RELATIONSHIP]: (state, action) => {
        const { newToEntity } = action.payload;

        return newToEntity ? {
            ...state,
            [newToEntity.dataEntryId]: undefined,
        } : state;
    },
    [viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP]: (state, action) => {
        const { entity } = action.payload;

        return (!entity.id) ? {
            ...state,
            [entity.dataEntryId]: undefined,
        } : state;
    },
}, 'generatedUniqueValuesCache');
