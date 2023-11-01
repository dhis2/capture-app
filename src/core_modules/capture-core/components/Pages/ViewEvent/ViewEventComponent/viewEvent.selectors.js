// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess, getEventProgramThrowIfNotFound } from '../../../../metaData';
import { convertValue as convertToServerValue } from '../../../../converters/clientToServer';
import { convertMainEventClientToServer } from '../../../../events/mainConverters';

const programIdSelector = state => state.currentSelections.programId;
const categoriesMetaSelector = state => state.currentSelections.categoriesMeta;
const eventContainerSelector = state => state.viewEventPage.loadedValues?.eventContainer;
const eventIdSelector = state => state.viewEventPage.eventId;

// $FlowFixMe[missing-annot] automated comment
export const makeProgramStageSelector = () => createSelector(
    programIdSelector,
    (programId: string) => getEventProgramThrowIfNotFound(programId).stage);

// $FlowFixMe[missing-annot] automated comment
export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    (programId: string, categoriesMeta: ?Object) => getEventProgramEventAccess(programId, categoriesMeta));

export const makeAssignedUserContextSelector = () =>
    // $FlowFixMe[missing-annot]
    createSelector(eventContainerSelector, eventIdSelector, (eventContainer, eventId) => {
        const { event: clientMainValues, values: clientValues } = eventContainer;
        const program = getEventProgramThrowIfNotFound(clientMainValues.programId);
        const formFoundation = program.stage.stageForm;
        const formServerValues = formFoundation.convertValues(clientValues, convertToServerValue);
        const mainDataServerValues: Object = convertMainEventClientToServer(clientMainValues);

        const event =
            {
                ...mainDataServerValues,
                dataValues: Object.keys(formServerValues).map(key => ({
                    dataElement: key,
                    value: formServerValues[key],
                })),
            };

        return { eventId, event };
    });
