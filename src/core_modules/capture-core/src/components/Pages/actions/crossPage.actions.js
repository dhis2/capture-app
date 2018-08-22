// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SELECTIONS_COMPLETENESS_CALCULATED: 'SelectionsCompletenessCalculated',
};

export const selectionsCompletenessCalculated =
    (isComplete: boolean) =>
        actionCreator(actionTypes.SELECTIONS_COMPLETENESS_CALCULATED)({ isComplete });
