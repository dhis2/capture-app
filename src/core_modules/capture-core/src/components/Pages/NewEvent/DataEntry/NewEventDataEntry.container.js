// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import NewEventDataEntry from './NewEventDataEntry.component';
import {
    startRunRulesOnUpdateForNewSingleEvent,
    requestSaveNewEventAndReturnToMainPage,
    cancelNewEventAndReturnToMainPage,
    batchActionTypes,
} from './newEventDataEntry.actions';
import {
    makeProgramNameSelector,
    makeFormFoundationSelector,
} from './newEventDataEntry.selector';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';

const makeMapStateToProps = () => {
    const programNameSelector = makeProgramNameSelector();
    const formFoundationSelector = makeFormFoundationSelector();

    const mapStateToProps = (state: ReduxState) => {
        const formFoundation = formFoundationSelector(state);

        return {
            ready: !state.newEventPage.dataEntryIsLoading,
            error: !formFoundation ?
                getTranslation('not_event_program_or_metadata_error', formatterOptions.CAPITALIZE_FIRST_LETTER) : null,
            formFoundation,
            programName: programNameSelector(state),
            orgUnitName: state.organisationUnits[state.currentSelections.orgUnitId] &&
                state.organisationUnits[state.currentSelections.orgUnitId].name,
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            innerAction,
            startRunRulesOnUpdateForNewSingleEvent(innerAction.payload),
        ], batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveNewEventAndReturnToMainPage(eventId, dataEntryId, formFoundation));
    },
    onCancel: () => {
        window.scrollTo(0, 0);
        dispatch(cancelNewEventAndReturnToMainPage());
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(withErrorMessageHandler()(NewEventDataEntry)),
);
