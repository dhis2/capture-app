// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { actionTypes, saveAssignee } from './assigneeSection.actions';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';
import { convertValue as convertToServerValue } from '../../../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../../../events/mainConverters';

export const saveAssigneeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.VIEW_EVENT_ASSIGNEE_SET),
        map(() => {
            const state = store.value;
            const eventId = state.viewEventPage.eventId;
            const eventContainer = state.viewEventPage.loadedValues.eventContainer;
            const { event: clientMainValues, values: clientValues } = eventContainer;
            const program = getEventProgramThrowIfNotFound(clientMainValues.programId);
            const formFoundation = program.stage.stageForm;
            const formServerValues = formFoundation.convertValues(clientValues, convertToServerValue);
            const mainDataServerValues: Object = convertMainEventClientToServer(clientMainValues);

            const serverData = {
                ...mainDataServerValues,
                dataValues: Object
                    .keys(formServerValues)
                    .map(key => ({
                        dataElement: key,
                        value: formServerValues[key],
                    })),
            };

            const currentSelectionSet = state.currentSelections;

            return saveAssignee(eventId, serverData, currentSelectionSet);
        }));
