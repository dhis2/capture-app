// @flow
import i18n from '@dhis2/d2-i18n';
import { canViewOtherUsers } from '../../../../../d2';
import {
    dataElementTypes as elementTypeKeys,
    getEventProgramThrowIfNotFound,
} from '../../../../../metaData';
import type { ProgramStage } from '../../../../../metaData';
import mainPropertyNames from '../../../../../events/mainPropertyNames.const';

const getDefaultMainConfig = (stage: ProgramStage) => {
    const baseFields = [
        [mainPropertyNames.EVENT_DATE, {
            id: mainPropertyNames.EVENT_DATE,
            visible: true,
            isMainProperty: true,
            // $FlowFixMe[prop-missing] automated comment
            type: elementTypeKeys.DATE,
        }],
        [mainPropertyNames.EVENT_STATUS, {
            id: mainPropertyNames.EVENT_STATUS,
            header: 'Status',
            visible: true,
            isMainProperty: true,
            // $FlowFixMe[prop-missing] automated comment
            type: elementTypeKeys.TEXT,
            singleSelect: true,
            options: [
                { text: i18n.t('Active'), value: 'ACTIVE' },
                { text: i18n.t('Completed'), value: 'COMPLETED' },
            ],
        }],
    ];

    const extraFields = [];
    if (stage.enableUserAssignment && canViewOtherUsers()) {
        const assigneeField = {
            id: mainPropertyNames.ASSIGNEE,
            type: 'ASSIGNEE',
            apiName: 'assignedUser',
            header: 'Assigned to',
            visible: true,
            isMainProperty: true,
        };
        extraFields.push([mainPropertyNames.ASSIGNEE, assigneeField]);
    }

    return [...baseFields, ...extraFields];
};

const getMetaDataConfig = (stage: ProgramStage): Array<Array<string | {id: string, visible: boolean}>> =>
    stage
        .stageForm
        .getElements()
        .map(element => ([
            element.id, {
                id: element.id,
                visible: element.displayInReports,
                type: element.type,
            }]),
        );

export const getDefaultConfig = (programId: string): Map<string, Object> => {
    const stage = getEventProgramThrowIfNotFound(programId).stage;
    // $FlowFixMe
    return new Map([
        ...getDefaultMainConfig(stage),
        ...getMetaDataConfig(stage),
    ]);
};
