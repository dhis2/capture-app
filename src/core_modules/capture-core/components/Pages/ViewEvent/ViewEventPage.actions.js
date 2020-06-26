// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const viewEventPageActionTypes = {
    ORG_UNIT_ID_CUSTOM_RESET: 'CustomOrgUnitIdReset',
    PROGRAM_ID_CUSTOM_RESET: 'CustomProgramIdReset',
};

export const customProgramIdReset = () => actionCreator(viewEventPageActionTypes.PROGRAM_ID_CUSTOM_RESET)();
export const customOrgUnitIdIdReset = () => actionCreator(viewEventPageActionTypes.PROGRAM_ID_CUSTOM_RESET)();
