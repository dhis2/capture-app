import type { ProgramStage } from '../metaData';

export const getDataElementsForRulesExecution = (stages: Map<string, ProgramStage>): Record<string, any> =>
    [...stages.values()]
        .flatMap(stage => stage.dataElements)
        .reduce((accRulesDataElements: Record<string, any>, dataElement: any) => {
            accRulesDataElements[dataElement.id] = dataElement;
            return accRulesDataElements;
        }, {});
