import type { StorageController } from 'capture-core-utils/storage';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import {
    USER_METADATA_STORES,
    getUserMetadataStorageController,
    type CachedProgram,
} from '../../../../storageControllers';
import { isProgramOrganisationUnit } from '../../../../utils/cachedDataQueries';
import { buildIcon } from '../../../../metaDataMemoryStoreBuilders/common/helpers';
import type { Icon } from '../../../../metaData';

export type Program = {
    id: string,
    name: string,
    icon: Icon,
    access: { data: { read: boolean } },
    organisationUnits: { [id: string]: boolean },
}

const getCachedPrograms = (
    storageController: StorageController,
): Promise<Array<Program>> =>
    storageController.getAll(
        USER_METADATA_STORES.PROGRAMS, {
            project: (cachedProgram: CachedProgram) => ({
                id: cachedProgram.id,
                name: cachedProgram.displayName,
                icon: buildIcon(cachedProgram.style),
                access: { data: { read: cachedProgram.access.data.read } },
                organisationUnits: [],
            }),
        },
    );

const appendProgramOrgUnit = (
    queryClient: QueryClient,
    program: Program,
    selectedOrgUnitId: string,
): Promise<Program> =>
    isProgramOrganisationUnit({
        queryClient,
        programId: program.id,
        orgUnitId: selectedOrgUnitId,
    }).then(result => ({
        ...program,
        organisationUnits: { [selectedOrgUnitId]: result },
    }));

export const useProgramsArray = (selectedOrgUnitId: string | null | undefined): Array<Program> => {
    const storageController = getUserMetadataStorageController();
    const queryClient = useQueryClient();
    const { data: programsArray } = useIndexedDBQuery(
        ['programSelectorPrograms', selectedOrgUnitId],
        () => getCachedPrograms(storageController).then(
            cachedPrograms => (selectedOrgUnitId ?
                Promise.all(cachedPrograms.map(program =>
                    appendProgramOrgUnit(queryClient, program, selectedOrgUnitId)),
                ) : cachedPrograms),
        ),
    );
    return programsArray || [];
};
