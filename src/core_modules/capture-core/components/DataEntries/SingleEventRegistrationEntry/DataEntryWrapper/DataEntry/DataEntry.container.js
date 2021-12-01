// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { startRunRulesPostUpdateField } from '../../../../DataEntry';
import { type RenderFoundation } from '../../../../../metaData';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import { withErrorMessageHandler } from '../../../../../HOC/withErrorMessageHandler';
import typeof { newEventSaveTypes } from './newEventSaveTypes';
import {
    makeProgramNameSelector,
} from './dataEntry.selectors';
import { DataEntryComponent } from './DataEntry.component';
import {
    startAsyncUpdateFieldForNewEvent,
    startRunRulesOnUpdateForNewSingleEvent,
    requestSaveNewEventAndReturnToMainPage,
    cancelNewEventAndReturnToMainPage,
    batchActionTypes,
    requestSaveNewEventAddAnother,
    setNewEventSaveTypes,
    addNewEventNote,
    newEventOpenNewRelationship,
    scrolledToRelationships,
    requestSaveNewEventInStage,
} from './actions/dataEntry.actions';

const makeMapStateToProps = () => {
    const programNameSelector = makeProgramNameSelector();

    const mapStateToProps = (state: ReduxState, props: Object) => {
        const isAddEventInStage = state.router.location.query.pathname === '/enrollmentEventNew';

        return { recentlyAddedRelationshipId: state.newEventPage.recentlyAddedRelationshipId,
            ready: !state.activePage.isDataEntryLoading,
            error: !props.formFoundation ?
                i18n.t('This is not an event program or the metadata is corrupt. See log for details.') : null,
            programName: programNameSelector(state),
            orgUnitName: state.organisationUnits[state.currentSelections.orgUnitId] &&
          state.organisationUnits[state.currentSelections.orgUnitId].name,
            stageName: props.stage?.name,
            isAddEventInStage };
    };


    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateDataEntryField: (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewSingleEvent({ ...innerAction.payload, uid }),
        ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH));
    },
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewSingleEvent({ ...innerAction.payload, uid }),
        ], batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH));
    },
    onStartAsyncUpdateField: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) => {
            const uid = uuid();
            return batchActions([
                successInnerAction,
                startRunRulesPostUpdateField(dataEntryId, itemId, uid),
                startRunRulesOnUpdateForNewSingleEvent({ ...successInnerAction.payload, dataEntryId, itemId, uid }),
            ], batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH);
        };
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveNewEventAndReturnToMainPage(eventId, dataEntryId, formFoundation));
    },
    onAddNote: (itemId: string, dataEntryId: string, note: string) => {
        dispatch(addNewEventNote(itemId, dataEntryId, note));
    },
    onSetSaveTypes: (newSaveTypes: ?Array<$Values<newEventSaveTypes>>) => {
        dispatch(setNewEventSaveTypes(newSaveTypes));
    },
    onSaveAndAddAnother: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        dispatch(requestSaveNewEventAddAnother(eventId, dataEntryId, formFoundation));
    },
    onCancel: () => {
        window.scrollTo(0, 0);
        dispatch(cancelNewEventAndReturnToMainPage());
    },
    onOpenAddRelationship: (eventId: string, dataEntryId: string) => {
        dispatch(newEventOpenNewRelationship(eventId, dataEntryId));
    },
    onScrollToRelationships: () => {
        dispatch(scrolledToRelationships());
    },
    onSaveEventInStage:
        (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, completed?: boolean) => {
            window.scrollTo(0, 0);
            dispatch(requestSaveNewEventInStage(eventId, dataEntryId, formFoundation, completed));
        },
});

// $FlowFixMe[missing-annot] automated comment
export const DataEntry = connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(withErrorMessageHandler()(DataEntryComponent)),
);
