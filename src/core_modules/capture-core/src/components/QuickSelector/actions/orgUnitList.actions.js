// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    INIT_REG_UNIT_LIST_ROOTS: 'initRegUnitListRoots',
    SEARCH_ORG_UNITS: 'searchRegisteringUnits',
    SET_ROOTS: 'setRegisteringUnitRoots',
};

export const initRegUnitListRoots = (roots: any) =>
    actionCreator(actionTypes.INIT_REG_UNIT_LIST_ROOTS)({ roots });

export const searchOrgUnits = (filter: string) =>
    actionCreator(actionTypes.SEARCH_ORG_UNITS)({ filter });

export const setRoots = (roots: Array<Object>, filter: string) =>
    actionCreator(actionTypes.SET_ROOTS)({ roots, filter });
