// @flow
import getStageFromProgramIdForEventProgram from '../../../../metaData/helpers/getStageFromProgramIdForEventProgram';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

const getMetaDataConfig = (stage: RenderFoundation) =>
    stage
        .getElements()
        .map(element => ({
            id: element.id,
            visible: element.displayInReports,
        }));

const getColumnsConfiguration = (programId: string): Promise<any> => {
    // TODO: retrieve columns configuration from system/user config.

    return new Promise((resolve, reject) => {
        const stageContainer = getStageFromProgramIdForEventProgram(programId);
        if (stageContainer.error) {
            reject();
        }

        // $FlowSuppress
        const stage: Stage = stageContainer.stage;
        resolve(
            getMetaDataConfig(stage),
        );
    });
};

export default getColumnsConfiguration;
