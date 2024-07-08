// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import type { ProgramStages } from '../EnrollmentPageDefault.types';
import { Program } from '../../../../../metaData';

export const useProgramStages = (program: Program, programStages?: ProgramStages) => useMemo(() => {
    const stages = [];
    if (program && programStages) {
        program.stages.forEach((item) => {
            const { id, name, icon, stageForm } = item;
            const { hideDueDate, programStageDataElements, repeatable, enableUserAssignment, dataAccess } = programStages.find(p => p.id === id) || {};
            if (!programStageDataElements) {
                log.error(errorCreator(i18n.t('Program stage not found'))(id));
            } else {
                stages.push({
                    id,
                    name,
                    icon,
                    hideDueDate,
                    repeatable,
                    enableUserAssignment,
                    description: stageForm.description,
                    dataAccess,
                    dataElements: programStageDataElements?.reduce((acc, currentStageData) => {
                        const { displayInReports, dataElement } = currentStageData;
                        if (displayInReports) {
                            const options = dataElement.optionSet ?
                                dataElement.optionSet.options?.reduce((accOptions, option) => {
                                    accOptions[option.code] = option.name;
                                    return accOptions;
                                }, {}) : undefined;
                            acc.push({
                                id: dataElement.id,
                                name: dataElement.displayName,
                                formName: dataElement.displayFormName,
                                type: dataElement.valueType,
                                options,
                                optionSet: dataElement.optionSet,
                            });
                        }
                        return acc;
                    }, []),
                });
            }
        });
        return stages;
    }


    return stages;
}, [program, programStages]);
