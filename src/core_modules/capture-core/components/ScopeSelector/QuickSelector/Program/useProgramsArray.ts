import type { StorageController } from 'capture-core-utils/storage';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import {
    USER_METADATA_STORES,
    getUserMetadataStorageController,
    type CachedProgram,
} from '../../../../storageControllers';
import { buildIcon } from '../../../../metaDataMemoryStoreBuilders/common/helpers';
import type { Icon } from '../../../../metaData';

export type Program = {
    id: string,
    name: string,
    icon: Icon,
    access: { data: { read: boolean } },
    organisationUnits: Array<{ [id: string]: boolean }>,
}

const getCachedPrograms = async (
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

const appendProgramOrgUnit = async (
    storageController: StorageController,
    program: Program,
    selectedOrgUnitId: string,
): Promise<Program> =>
    storageController.get(
        USER_METADATA_STORES.ORGANISATION_UNITS_BY_PROGRAM,
        program.id, {
            project: cachedProgramOrgUnits => ({
                [selectedOrgUnitId]: cachedProgramOrgUnits.organisationUnits[selectedOrgUnitId] ?? false,
            }),
        },
    ).then(organisationUnits => ({
        ...program,
        organisationUnits,
    }));

export const useProgramsArray = (selectedOrgUnitId: string | null | undefined): Array<Program> => {
    const storageController = getUserMetadataStorageController();
    const { data: programsArray } = useIndexedDBQuery(
        ['programSelectorPrograms', selectedOrgUnitId],
        () => getCachedPrograms(storageController).then(
            cachedPrograms => (selectedOrgUnitId ?
                Promise.all(cachedPrograms.map(program =>
                    appendProgramOrgUnit(storageController, program, selectedOrgUnitId)),
                ) : cachedPrograms),
        ),
    );
    return programsArray || [];
};
