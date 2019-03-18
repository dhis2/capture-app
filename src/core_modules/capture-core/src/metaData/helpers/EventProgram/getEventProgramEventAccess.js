// @flow
import getEventProgramThrowIfNotFound from './getEventProgramThrowIfNotFound';


export default function (programId: string, categories: ?{ [categoryId: string]: string }) {
    const program = getEventProgramThrowIfNotFound(programId);
    const stage = program.getStageThrowIfNull();
    let access = {
        read: stage.stageForm.access.data.read,
        write: stage.stageForm.access.data.write,
    };

    if (categories && program.categoryCombination) {
        Object.keys(categories).forEach((key) => {
            // $FlowFixMe
            const category = program.categoryCombination.getCategoryThrowIfNotFound(key);
            // $FlowFixMe
            const categoryOption = category.getOptionThrowIfNotFound(categories[key]);
            access = {
                read: access.read ? categoryOption.access.data.read : false,
                write: access.write ? categoryOption.access.data.write : false,
            };
        });
    }
    return access;
}
