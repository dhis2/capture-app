// @flow
import type { ProgramStage } from '../metaData';

export const getDataElementsForRulesExecution = (stages: Map<string, ProgramStage>) =>
    [...stages.values()]
        .flatMap(stage => stage.stageForm.getElements())
        .reduce((accRulesDataElements, dataElement) => {
            accRulesDataElements[dataElement.id] = {
                id: dataElement.id,
                valueType: dataElement.type,
                optionSetId: dataElement.optionSet && dataElement.optionSet.id,
                name: dataElement.formName || dataElement.name,
            };
            return accRulesDataElements;
        }, {});
