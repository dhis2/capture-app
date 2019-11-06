// @flow
import getEventProgramThrowIfNotFound from './getEventProgramThrowIfNotFound';

export default function getEventAccess(
    programId: string,
    categoriesMeta: ?{ [categoryId: string]: { writeAccess: boolean } }) {
    const program = getEventProgramThrowIfNotFound(programId);
    const stage = program.getStageThrowIfNull();
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
