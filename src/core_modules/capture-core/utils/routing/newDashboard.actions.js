// @flow
import { actionCreator } from '../../actions/actions.utils';

export const newDashboardActionTypes = {
    ENABLE_NEW_DASHBOARDS_TEMPORARILY: 'EnableNewDasboardsTemporarily',
};

export const enableNewDashboardsTemporarily = (programs: Array<string>) =>
    actionCreator(newDashboardActionTypes.ENABLE_NEW_DASHBOARDS_TEMPORARILY)({ programs });
