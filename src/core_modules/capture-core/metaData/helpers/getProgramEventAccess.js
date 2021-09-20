// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getProgramFromProgramIdThrowIfNotFound } from './getProgramFromProgramIdThrowIfNotFound';
import { EventProgram } from '../Program';

export function getProgramEventAccess(
    programId: string,
    programStageId: ?string,
    categoriesMeta: ?{ [categoryId: string]: { writeAccess: boolean } },
) {
    const program = getProgramFromProgramIdThrowIfNotFound(programId);
    let stage;
    if (program instanceof EventProgram) {
        stage = program.stage;
    } else if (programStageId) {
        stage = program.getStage(programStageId);
    }
    if (!stage) {
        log.error(errorCreator('stage not found')({ programId, programStageId }));
        return null;
    }
    const access = {
        read: stage.stageForm.access.data.read,
        write: stage.stageForm.access.data.write,
    };

    if (categoriesMeta && access.write) {
        access.write = Object
            .keys(categoriesMeta)
            .every(key => categoriesMeta[key].writeAccess);
    }

    return access;
}
