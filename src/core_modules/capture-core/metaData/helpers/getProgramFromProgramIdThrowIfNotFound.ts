import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../../metaDataMemoryStores';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
};

export function getProgramFromProgramIdThrowIfNotFound(programId: string) {
    const program = programCollection.get(programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ programId }));
        throw Error(i18n.t('An error has occurred. See log for details'));
    }
    return program;
}
