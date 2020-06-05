// @flow

export { NewEventPage } from './Page';
// actions
export {
    actionTypes as dataEntryActionTypes,
} from './DataEntry/actions/dataEntry.actions';
export {
    actionTypes as dataEntryUrlActionTypes,
    updateSelectionsFromUrl,
} from './DataEntry/actions/dataEntryUrl.actions';

export {
    actionTypes as dataEntryWrapperActionTypes,
} from './DataEntryWrapper/newEventDataEntryWrapper.actions';
export {
    actionTypes as newRelationshipActionTypes,
} from './NewRelationshipWrapper/NewEventNewRelationshipWrapper.actions';
export {
    actionTypes as selectionsIncompleteActionTypes,
} from './SelectionsIncomplete/dataEntrySelectionsIncomplete.actions';

// epics
export { cancelNewEventEpic, cancelNewEventLocationChangeEpic } from './DataEntry/epics/cancelNewSingleEvent.epics';
export {
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
} from './epics/cancelNewSingleEventSelectionsIncomplete.epics';
export {
    resetDataEntryForNewEventEpic,
    openNewEventInDataEntryEpic,
    resetRecentlyAddedEventsWhenNewEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForSingleEventEpic,
    runRulesOnUpdateFieldForSingleEventEpic,
} from './DataEntry/epics/newEventDataEntry.epics';
export {
    saveNewEventEpic,
    saveNewEventLocationChangeEpic,
} from './DataEntry/epics/saveNewSingleEvent.epics';
export {
    saveNewEventAddAnotherEpic,
    saveNewEventAddAnotherFailedEpic,
} from './DataEntry/epics/saveNewSingleEventAddAnother.epics';

export {
    addNoteForNewSingleEventEpic,
} from './DataEntry/epics/addNoteForNewSingleEvent.epics';

export {
    openRelationshipForNewSingleEventEpic,
    addRelationshipForNewSingleEventEpic,
    saveNewEventRelationshipsIfExistsEpic,
    saveNewEventRelationshipFinishedEpic,
    teiForNewEventRelationshipSavedEpic,
} from './DataEntry/epics/addRelationshipForNewSingleEvent.epics';
