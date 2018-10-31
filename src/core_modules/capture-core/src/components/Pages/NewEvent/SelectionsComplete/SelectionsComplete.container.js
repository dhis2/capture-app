// @flow
import { connect } from 'react-redux';
import SelectionsComplete from './SelectionsComplete.component';
import {
    setNewEventFormLayoutDirection,
} from './selectionsComplete.actions';
import {
    makeFormFoundationSelector,
} from './selectionsComplete.selectors';
import getDataEntryHasChanges from '../getNewEventDataEntryHasChanges';


const makeMapStateToProps = () => {
    const formFoundationSelector = makeFormFoundationSelector();

    const mapStateToProps = (state: ReduxState) => {
        const formFoundation = formFoundationSelector(state);

        return {
            formFoundation,
            dataEntryHasChanges: getDataEntryHasChanges(state),
            formHorizontal: (formFoundation && formFoundation.customForm ? false : !!state.newEventPage.formHorizontal),
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFormLayoutDirectionChange: (formHorizontal: boolean) => {
        dispatch(setNewEventFormLayoutDirection(formHorizontal));
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(SelectionsComplete);
