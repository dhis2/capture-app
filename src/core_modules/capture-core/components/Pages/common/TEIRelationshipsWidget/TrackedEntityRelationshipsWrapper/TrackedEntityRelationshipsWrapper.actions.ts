import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    WIDGET_SELECT_FIND_MODE: 'WidgetSelectFindMode',
};

export const batchActionTypes = {
    BATCH_OPEN_TEI_SEARCH_WIDGET: 'batchOpenTeiSearchWidget',
};

type SelectFindModeParams = {
    findMode: string;
    orgUnit: {
        id: string;
        name: string;
        path: string;
    } | null;
    relationshipConstraint: Record<string, any>;
};

export const selectFindMode = ({ findMode, orgUnit, relationshipConstraint }: SelectFindModeParams) =>
    actionCreator(actionTypes.WIDGET_SELECT_FIND_MODE)({ findMode, orgUnit, relationshipConstraint });
