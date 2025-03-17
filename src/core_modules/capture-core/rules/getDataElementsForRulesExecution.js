// @flow
import type { ProgramStage } from '../metaData';

export const getDataElementsForRulesExecution = (stages: Map<string, ProgramStage>) =>
    [...stages.values()]
        .flatMap(stage => stage.dataElements)
        .reduce((accRulesDataElements, dataElement) => {
            accRulesDataElements[dataElement.id] = dataElement;
            return accRulesDataElements;
        }, {});
