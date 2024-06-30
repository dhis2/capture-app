// @flow
import type { CachedOptionSet, CachedProgramStage, CachedRelationshipType } from '../../../../storageControllers';
import type { DataEntryFormConfig } from '../TEIAndEnrollment';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import { ProgramStageFactory } from '../../../../metaDataMemoryStoreBuilders/programs/factory/programStage';

export const buildProgramStageMetadata = async ({
    cachedProgramStage,
    programId,
    cachedOptionSets,
    locale,
    minorServerVersion,
    dataEntryFormConfig,
}: {
    cachedProgramStage: CachedProgramStage,
    programId: string,
    cachedOptionSets: Array<CachedOptionSet>,
    cachedRelationshipTypes: Array<CachedRelationshipType>,
    dataEntryFormConfig: ?DataEntryFormConfig,
    locale: string,
    minorServerVersion: number,
}) => {
    const storageController = getUserStorageController();

    const cachedRelationshipTypes = await storageController.getAll(userStores.RELATIONSHIP_TYPES);

    const programStageFactory = new ProgramStageFactory({
        cachedOptionSets: new Map<string, CachedOptionSet>(cachedOptionSets.map(optionSet => [optionSet.id, optionSet])),
        cachedRelationshipTypes,
        locale,
        minorServerVersion,
        dataEntryFormConfig,
    });

    return programStageFactory.build(
        cachedProgramStage,
        programId,
    );
};
