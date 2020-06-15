// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    SKIP_RELOAD_RESET: 'MainPageEventsWorkingListsSkipReloadReset',
};

export const resetSkipReload = () => actionCreator(actionTypes.SKIP_RELOAD_RESET)();
