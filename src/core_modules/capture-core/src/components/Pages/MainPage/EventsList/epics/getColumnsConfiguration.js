// @flow
import getStageFromProgramIdForEventProgram from '../../../../../metaData/helpers/EventProgram/getStageFromProgramIdForEventProgram';
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';
import mainPropertyNames from '../../../../../events/mainPropertyNames.const';

export type ColumnConfig = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
};

const getDefaultMainConfig = () => ({
    id: mainPropertyNames.EVENT_DATE,
    visible: true,
    isMainProperty: true,
});

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
                getDefaultMainConfig(),
                ...getMetaDataConfig(stageForm),
            ],
        );
    })
;

export default getColumnsConfiguration;
