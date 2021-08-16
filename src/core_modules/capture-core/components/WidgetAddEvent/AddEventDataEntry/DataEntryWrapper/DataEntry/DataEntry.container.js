// @flow
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import { DataEntryComponent } from './DataEntry.component';
import { startRunRulesPostUpdateField } from '../../../../DataEntry';
import {
    startAsyncUpdateFieldForNewEvent,
    startRunRulesOnUpdateForAddEvent,
    requestSaveAddEventAndReturnToOverviewPage,
    cancelAddEventAndReturnToOverviewPage,
    batchActionTypes,
    setNewEventSaveTypes,
    addNewEventNote,
    newEventOpenNewRelationship,
    scrolledToRelationships,
} from './actions/dataEntry.actions';
import {
    makeProgramNameSelector,
} from './dataEntry.selectors';
import { type RenderFoundation } from '../../../../../metaData';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import { withErrorMessageHandler } from '../../../../../HOC/withErrorMessageHandler';
import typeof { addEventSaveTypes } from './addEventSaveTypes';

const makeMapStateToProps = () => {
    const programNameSelector = makeProgramNameSelector();

    const mapStateToProps = (state: ReduxState, props: Object) => ({
        recentlyAddedRelationshipId: state.newEventPage.recentlyAddedRelationshipId,
        ready: !state.activePage.isDataEntryLoading,
        error: !props.formFoundation ?
            i18n.t('This is not an event program or the metadata is corrupt. See log for details.') : null,
        programName: programNameSelector(state),
        orgUnitName: state.organisationUnits[state.currentSelections.orgUnitId] &&
          state.organisationUnits[state.currentSelections.orgUnitId].name,
    });


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
            startRunRulesOnUpdateForAddEvent({ ...innerAction.payload, uid }),
        ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH));
    },
    onUpdateField: (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForAddEvent({ ...innerAction.payload, uid }),
        ], batchActionTypes.UPDATE_FIELD_ADD_EVENT_ACTION_BATCH));
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
                startRunRulesOnUpdateForAddEvent({ ...successInnerAction.payload, dataEntryId, itemId, uid }),
            ], batchActionTypes.UPDATE_FIELD_ADD_EVENT_ACTION_BATCH);
        };
        const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

        dispatch(startAsyncUpdateFieldForNewEvent(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
    },
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, completed?: boolean) => {
        window.scrollTo(0, 0);
        dispatch(requestSaveAddEventAndReturnToOverviewPage(eventId, dataEntryId, formFoundation, completed));
    },
    onAddNote: (itemId: string, dataEntryId: string, note: string) => {
        dispatch(addNewEventNote(itemId, dataEntryId, note));
    },
    onSetSaveTypes: (newSaveTypes: ?Array<$Values<addEventSaveTypes>>) => {
        dispatch(setNewEventSaveTypes(newSaveTypes));
    },
    onCancel: () => {
        window.scrollTo(0, 0);
        dispatch(cancelAddEventAndReturnToOverviewPage());
    },
    onOpenAddRelationship: (eventId: string, dataEntryId: string) => {
        dispatch(newEventOpenNewRelationship(eventId, dataEntryId));
    },
    onScrollToRelationships: () => {
        dispatch(scrolledToRelationships());
    },
});

// $FlowFixMe[missing-annot] automated comment
export const DataEntry = connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(withErrorMessageHandler()(DataEntryComponent)),
);
