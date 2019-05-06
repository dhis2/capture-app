// @flow
import i18n from '@dhis2/d2-i18n';
import { getStageFromProgramIdForEventProgram } from '../../../../../metaData';
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';
import mainPropertyNames from '../../../../../events/mainPropertyNames.const';
import elementTypeKeys from '../../../../../metaData/DataElement/elementTypes';

export type ColumnConfig = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
};

const getDefaultMainConfig = () => [
    {
        id: mainPropertyNames.EVENT_DATE,
        visible: true,
        isMainProperty: true,
        type: elementTypeKeys.DATE,
    },
    {
        id: mainPropertyNames.EVENT_STATUS,
        header: 'Status',
        visible: true,
        isMainProperty: true,
        type: elementTypeKeys.TEXT,
        singleSelect: true,
        options: [
            { text: i18n.t('Active'), value: 'ACTIVE' },
            { text: i18n.t('Completed'), value: 'COMPLETED' },
        ],
    },
];

const getMetaDataConfig = (stage: RenderFoundation) =>
    stage
        .getElements()
        .map(element => ({
            id: element.id,
            visible: element.displayInReports,
        }));

const getColumnsConfiguration = (programId: string): Promise<Array<ColumnConfig>> =>
    // TODO: retrieve columns configuration from system/user config.

    new Promise((resolve, reject) => {
        const stageContainer = getStageFromProgramIdForEventProgram(programId);
        if (stageContainer.error) {
            reject();
        }

        // $FlowSuppress
        const stageForm: RenderFoundation = stageContainer.stage.stageForm;
        resolve(
            [
                ...getDefaultMainConfig(),
                ...getMetaDataConfig(stageForm),
            ],
        );
    })
;

export default getColumnsConfiguration;
