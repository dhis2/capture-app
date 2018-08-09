// @flow
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import NewEventDataEntry from './NewEventDataEntry.component';
import {
    startAsyncUpdateFieldForNewEvent,
    startRunRulesOnUpdateForNewSingleEvent,
    requestSaveNewEventAndReturnToMainPage,
    cancelNewEventAndReturnToMainPage,
    batchActionTypes,
    requestSaveNewEventAddAnother,
    setNewEventSaveTypes,
} from './newEventDataEntry.actions';
import {
    makeProgramNameSelector,
    makeFormFoundationSelector,
} from './newEventDataEntry.selector';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import { saveTypes } from './newEventSaveTypes';

const makeMapStateToProps = () => {
    const programNameSelector = makeProgramNameSelector();
    const formFoundationSelector = makeFormFoundationSelector();

    const mapStateToProps = (state: ReduxState) => {
        const formFoundation = formFoundationSelector(state);

        return {
            saveTypes: state.newEventPage.saveTypes,
            formHorizontal: !!state.newEventPage.formHorizontal,
            ready: !state.newEventPage.dataEntryIsLoading,
            error: !formFoundation ?
                i18n.t('This is not an event program or the metadata is corrupt. See log for details.') : null,
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
    onStartAsyncUpdateField: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: Function,
        dataEntryId: string,
        itemId: string,
    ) => {
        dispatch(startAsyncUpdateFieldForNewEvent(fieldId, fieldLabel, formBuilderId, formId, callback, dataEntryId, itemId));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveNewEventAndReturnToMainPage(eventId, dataEntryId, formFoundation));
    },
    onSetSaveTypes: (newSaveTypes: ?Array<$Values<typeof saveTypes>>) => {
        dispatch(setNewEventSaveTypes(newSaveTypes));
    },
    onSaveAndAddAnother: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        dispatch(requestSaveNewEventAddAnother(eventId, dataEntryId, formFoundation));
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
