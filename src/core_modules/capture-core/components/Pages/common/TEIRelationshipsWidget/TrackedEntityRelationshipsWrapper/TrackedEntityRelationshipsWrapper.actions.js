// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import type { OnSelectFindModeProps } from '../../../../WidgetsRelationship/WidgetTrackedEntityRelationship';

export const actionTypes = {
    WIDGET_SELECT_FIND_MODE: 'widgetSelectFindMode',
};

export const batchActionTypes = {
    BATCH_OPEN_TEI_SEARCH_WIDGET: 'batchOpenTeiSearchWidget',
};

export const selectFindMode = ({ findMode, relationshipConstraint }: OnSelectFindModeProps) =>
    actionCreator(actionTypes.WIDGET_SELECT_FIND_MODE)({ findMode, relationshipConstraint });
