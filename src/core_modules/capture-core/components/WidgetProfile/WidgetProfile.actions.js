// @flow
import { actionCreator } from '../../actions/actions.utils';

export const profileWidgetActionTypes = {
    INFORMATION_FETCH: 'ProfileWidget.Fetch',
    INFORMATION_SUCCESS_FETCH: 'ProfileWidget.SuccessFetch',
};

export const fetchProfileInformation = () =>
    actionCreator(profileWidgetActionTypes.INFORMATION_FETCH)();

export const successFetchProfile = ({ attributes }: Object) =>
    actionCreator(profileWidgetActionTypes.INFORMATION_SUCCESS_FETCH)({ attributes });

