import { createSelector } from 'reselect';
import { getEventProgramEventAccess, getEventProgramThrowIfNotFound } from '../../../../metaData';
import { convertMainEventClientToServer } from '../../../../events/mainConverters';

const programIdSelector = (state: any) => state.currentSelections.programId;
const categoriesMetaSelector = (state: any) => state.currentSelections.categoriesMeta;
const eventContainerSelector = (state: any) => state.viewEventPage.loadedValues?.eventContainer;

export const makeProgramStageSelector = () => createSelector(
    programIdSelector,
    (programId: string) => getEventProgramThrowIfNotFound(programId).stage);

export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    (programId: string, categoriesMeta?: any) => getEventProgramEventAccess(programId, categoriesMeta));

export const makeAssignedUserContextSelector = () =>
    createSelector(eventContainerSelector, (eventContainer: any) => {
        const { event: clientMainValues, values: clientValues } = eventContainer;
        const program = getEventProgramThrowIfNotFound(clientMainValues.programId);
        const formFoundation = program.stage.stageForm;
        const formServerValues = formFoundation.convertValues(clientValues);
        const mainDataServerValues: any = convertMainEventClientToServer(clientMainValues);

        const event =
            {
                ...mainDataServerValues,
                dataValues: Object.keys(formServerValues).map(key => ({
                    dataElement: key,
                    value: formServerValues[key],
                })),
            };

        return { event };
    });
