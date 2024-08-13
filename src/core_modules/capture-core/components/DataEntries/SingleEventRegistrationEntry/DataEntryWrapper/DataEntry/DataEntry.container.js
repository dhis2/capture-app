// @flow
import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import { type OrgUnit } from '@dhis2/rules-engine-javascript';
import { DataEntryComponent } from './DataEntry.component';
import { startRunRulesPostUpdateField } from '../../../../DataEntry';
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
import {
    makeProgramNameSelector,
} from './dataEntry.selectors';
import { type RenderFoundation } from '../../../../../metaData';
import { withLoadingIndicator, withErrorMessageHandler } from '../../../../../HOC';
import typeof { newEventSaveTypes } from './newEventSaveTypes';

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
    onUpdateDataEntryField: (orgUnit: OrgUnit) => (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewSingleEvent({ ...innerAction.payload, uid, orgUnit }),
        ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH));
    },
    onUpdateField: (orgUnit: OrgUnit) => (innerAction: ReduxAction<any, any>) => {
        const { dataEntryId, itemId } = innerAction.payload;
        const uid = uuid();

        dispatch(batchActions([
            innerAction,
            startRunRulesPostUpdateField(dataEntryId, itemId, uid),
            startRunRulesOnUpdateForNewSingleEvent({ ...innerAction.payload, uid, orgUnit }),
        ], batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH));
    },
    onStartAsyncUpdateField: (orgUnit: OrgUnit) => (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
    ) => {
        const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) => {
            const uid = uuid();
            return batchActions([
                successInnerAction,
                startRunRulesPostUpdateField(dataEntryId, itemId, uid),
                startRunRulesOnUpdateForNewSingleEvent({ ...successInnerAction.payload, dataEntryId, itemId, uid, orgUnit }),
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
