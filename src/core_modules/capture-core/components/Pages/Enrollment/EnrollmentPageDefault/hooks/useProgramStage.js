// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import type { apiProgramStage } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';
import { Program } from '../../../../../metaData';

export const useProgramStage = (program: Program, programStages: Array<apiProgramStage>) => {
    const stages = [];
    if (program && programStages) {
        program.stages.forEach((item) => {
            const { id, name, icon, stageForm } = item;
            const { programStageDataElements } = programStages.find(p => p.id === id) || {};
            if (!programStageDataElements) {
                log.error(errorCreator(i18n.t('Program stage not found'))(id));
            } else {
                stages.push({
                    id,
                    name,
                    icon,
                    description: stageForm.description,
                    dataElements: programStageDataElements?.reduce((acc, curr) => {
                        acc.push(curr.dataElement);
                        return acc;
                    }, []),
                });
            }
        });
        return stages;
    }


    return stages;
};
