// @flow
import i18n from '@dhis2/d2-i18n';
import {
    type ProgramStage,
    dataElementTypes as elementTypeKeys,
    type EventProgram,
} from '../../../../../../metaData';
import mainPropertyNames from '../../../../../../events/mainPropertyNames.const';
import type { ColumnConfigs, MetadataColumnConfig, MainColumnConfig } from '../../../WorkingLists';

const getDefaultMainConfig = (stage: ProgramStage): Array<MainColumnConfig> => {
    const baseFields = [{
        id: mainPropertyNames.EVENT_DATE,
        visible: true,
        // $FlowFixMe[prop-missing] automated comment
        type: elementTypeKeys.DATE,
        header: stage.stageForm.getLabel(mainPropertyNames.EVENT_DATE),
    }, {
        id: mainPropertyNames.EVENT_STATUS,
        visible: true,
        // $FlowFixMe[prop-missing] automated comment
        type: elementTypeKeys.TEXT,
        header: 'Status',
        singleSelect: true,
        options: [
            { text: i18n.t('Active'), value: 'ACTIVE' },
            { text: i18n.t('Completed'), value: 'COMPLETED' },
        ],
    }];

    const optionalFields = [];
    if (stage.enableUserAssignment) {
        optionalFields.push({
            id: mainPropertyNames.ASSIGNEE,
            visible: true,
            type: 'ASSIGNEE',
            header: 'Assigned to',
            apiName: 'assignedUser',
        });
    }

    return [...baseFields, ...optionalFields]
        .map(field => ({
            ...field,
            isMainProperty: true,
        }));
};

const getMetaDataConfig = (stage: ProgramStage): Array<MetadataColumnConfig> =>
    stage
        .stageForm
        .getElements()
        .map(element => ({
            id: element.id,
            visible: element.displayInReports,
            type: element.type,
            header: element.formName,
            optionSet: element.optionSet,
        }));

export const getDefaultColumnConfig = (program: EventProgram): ColumnConfigs => {
    const stage = program.stage;
    return [
        ...getDefaultMainConfig(stage),
        ...getMetaDataConfig(stage),
    ];
};
