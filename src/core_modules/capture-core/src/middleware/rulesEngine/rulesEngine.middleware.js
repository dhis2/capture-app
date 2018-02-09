// @flow
import { actionTypes as d2FormActionTypes } from '../../components/D2Form/D2SectionFields.actions';

type Next = (action: ReduxAction) => void;

const actionTypes = {
    UPDATE_VALUES: 'UpdateFormsValues',
    UPDATE_MESSAGES: 'RulesUpdateMessages',
    UPDATE_HIDDEN: 'RulesUpdateHidden',
};

function runRulesEngine() {
    
}


export default (store: ReduxStore) => (next: Next) => (action: ReduxAction) => {
    if (action.type === d2FormActionTypes.UPDATE_FIELD) {

    } else {
        next(action);
    }
};
