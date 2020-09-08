// @flow
import i18n from '@dhis2/d2-i18n';
import {
    RenderFoundation,
    ProgramStage,
    dataElementTypes as elementTypeKeys,
} from '../../../../../../metaData';
import mainPropertyNames from '../../../../../../events/mainPropertyNames.const';

export const getDefaultMainConfig = (stage: ProgramStage) => {
    const baseFields = [
        {
            id: mainPropertyNames.EVENT_DATE,
            visible: true,
            isMainProperty: true,
            // $FlowFixMe[prop-missing] automated comment
            type: elementTypeKeys.DATE,
        },
        {
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
        },
    ];

    const extraFields = [];
    if (stage.enableUserAssignment) {
        const assigneeField = {
            id: mainPropertyNames.ASSIGNEE,
            type: 'ASSIGNEE',
            apiName: 'assignedUser',
            header: 'Assigned to',
            visible: true,
            isMainProperty: true,
        };
        extraFields.push(assigneeField);
    }

    return [...baseFields, ...extraFields];
};

export const getMetaDataConfig = (stage: RenderFoundation): Array<{id: string, visible: boolean}> =>
    stage
        .getElements()
        .map(element => ({
            id: element.id,
            visible: element.displayInReports,
        }));
