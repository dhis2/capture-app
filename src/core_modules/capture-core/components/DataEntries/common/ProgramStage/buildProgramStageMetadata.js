// @flow
import type {
    CachedDataElement,
    CachedOptionSet,
    CachedProgramStage,
} from '../../../../storageControllers';
import type { DataEntryFormConfig } from '../TEIAndEnrollment';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../storageControllers';
import { ProgramStageFactory } from '../../../../metaDataMemoryStoreBuilders/programs/factory/programStage';

export const buildProgramStageMetadata = async ({
    cachedProgramStage,
    programId,
    cachedDataElements,
    cachedOptionSets,
    locale,
    minorServerVersion,
    dataEntryFormConfig,
}: {
    cachedProgramStage: CachedProgramStage,
    programId: string,
    cachedOptionSets: Array<CachedOptionSet>,
    cachedDataElements: Array<CachedDataElement>,
    dataEntryFormConfig: ?DataEntryFormConfig,
    locale: string,
    minorServerVersion: number,
}) => {
    const storageController = getUserMetadataStorageController();

    const cachedRelationshipTypes = await storageController.getAll(USER_METADATA_STORES.RELATIONSHIP_TYPES);
    const cachedProgramRules = await storageController.getAll(USER_METADATA_STORES.PROGRAM_RULES, {
        predicate: rule => rule.programStageId === cachedProgramStage.id,
    });

    const programStageFactory = new ProgramStageFactory({
        cachedOptionSets: new Map<string, CachedOptionSet>(cachedOptionSets.map(optionSet => [optionSet.id, optionSet])),
        cachedRelationshipTypes,
        cachedDataElements: new Map<string, CachedDataElement>(cachedDataElements.map(dataElement => [dataElement.id, dataElement])),
        locale,
        minorServerVersion,
        dataEntryFormConfig,
    });

    return programStageFactory.build(
        cachedProgramStage,
        programId,
    ).then((stage) => {
        stage.programRules = cachedProgramRules;
        return stage;
    });
};
