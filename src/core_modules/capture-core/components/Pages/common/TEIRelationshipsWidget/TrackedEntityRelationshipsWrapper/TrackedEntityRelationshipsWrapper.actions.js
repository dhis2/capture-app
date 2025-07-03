import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    WIDGET_SELECT_FIND_MODE: 'WidgetSelectFindMode',
};

export const batchActionTypes = {
    BATCH_OPEN_TEI_SEARCH_WIDGET: 'batchOpenTeiSearchWidget',
};

export const selectFindMode = ({ findMode, orgUnit, relationshipConstraint }) =>
    actionCreator(actionTypes.WIDGET_SELECT_FIND_MODE)({ findMode, orgUnit, relationshipConstraint });
