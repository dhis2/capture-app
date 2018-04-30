// @flow
import getStageFromProgramIdForEventProgram from '../../../../metaData/helpers/getStageFromProgramIdForEventProgram';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

export const mainPropertyNames = {
    EVENT_DATE: 'eventDate',
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
            [
                getDefaultMainConfig(),
                ...getMetaDataConfig(stage),
            ],
        );
    });
};

export default getColumnsConfiguration;
