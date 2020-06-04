// @flow
import { push } from 'connected-react-router';
import {
    searchPageSelectorActonTypes,
    batchActionTypes as mainPageSelectorBatchActionTypes,
} from './SearchPageSelector.actions';

const getArguments = (programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

export const searchPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        searchPageSelectorActonTypes.RESET_ORG_UNIT_ID,
        searchPageSelectorActonTypes.SET_ORG_UNIT,
        searchPageSelectorActonTypes.SET_PROGRAM_ID,
        searchPageSelectorActonTypes.RESET_PROGRAM_ID,
        mainPageSelectorBatchActionTypes.START_AGAIN,
        mainPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION,
    )
        .map(({ payload }) => {
            const { programId, orgUnitId } = payload;
            const args = getArguments(programId, orgUnitId);
            return push(`/search/${args}`);
        });
