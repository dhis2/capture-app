// @flow
import { connect } from 'react-redux';
import NewEventDataEntryWrapper from './NewEventDataEntryWrapper.component';
import {
    setNewEventFormLayoutDirection,
} from './newEventDataEntryWrapper.actions';
import {
    makeStageSelector,
} from './newEventDataEntryWrapper.selectors';
import getDataEntryHasChanges from '../getNewEventDataEntryHasChanges';


const makeMapStateToProps = () => {
    const stageSelector = makeStageSelector();

    const mapStateToProps = (state: ReduxState) => {
        const stage = stageSelector(state);
        const formFoundation = stage && stage.stageForm ? stage.stageForm : null;
        return {
            stage,
            formFoundation,
            dataEntryHasChanges: getDataEntryHasChanges(state),
            formHorizontal: (formFoundation && formFoundation.customForm ? false : !!state.newEventPage.formHorizontal),
        };
    };


    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFormLayoutDirectionChange: (formHorizontal: boolean) => {
        dispatch(setNewEventFormLayoutDirection(formHorizontal));
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(NewEventDataEntryWrapper);
