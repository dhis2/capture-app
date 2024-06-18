// @flow
import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { useProgramFromIndexedDB } from '../../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useUserLocale } from '../../../../../utils/localeData/useUserLocale';
import { ProgramStageFactory } from '../../../../../metaDataMemoryStoreBuilders/programs/factory/programStage';
import { useIndexedDBQuery } from '../../../../../utils/reactQueryHelpers';
import type { ProgramStage, RenderFoundation } from '../../../../../metaData';
import type { CachedOptionSet, CachedProgramStage, CachedRelationshipType } from '../../../../../storageControllers';
import { useDataElementsForStage } from './useDataElementsForStage';
import {
    useOptionSetsForAttributes,
} from '../../../common/TEIAndEnrollment/useMetadataForRegistrationForm/hooks/useOptionSetsForAttributes';
import { getUserStorageController, userStores } from '../../../../../storageControllers';
import {
    useDataEntryFormConfig,
} from '../../../common/TEIAndEnrollment/useMetadataForRegistrationForm/hooks/useDataEntryFormConfig';
import type { DataEntryFormConfig } from '../../../common/TEIAndEnrollment';

type Props = {|
    programId: string,
|}

type ReturnType = {|
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
|}

const buildProgramStage = async ({
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

    // Not sure how to better filter related types
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

export const useMetadataForSingleEventForm = ({
    programId,
}: Props): ReturnType => {
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });
    const { dataEntryFormConfig, configIsFetched } = useDataEntryFormConfig({ selectedScopeId: programId });
    const { locale } = useUserLocale();
    const { serverVersion: { minor } } = useConfig();

    const cachedDataElementIds = useMemo(() => (program && program
        .programStages[0]
        .programStageDataElements
        .map(dataElement => dataElement.dataElementId)) || [], [program]);

    const { dataElements } = useDataElementsForStage({
        programId,
        dataElementIds: cachedDataElementIds,
    });

    const { optionSets } = useOptionSetsForAttributes({
        attributes: dataElements,
        selectedScopeId: programId,
    });

    const { data: programStage } = useIndexedDBQuery(
        // $FlowFixMe
        ['formFoundation', program?.id],
        // $FlowFixMe
        () => buildProgramStage({
            // $FlowFixMe
            cachedProgramStage: program.programStages[0],
            programId,
            // $FlowFixMe
            cachedOptionSets: optionSets,
            locale,
            minorServerVersion: minor,
            dataEntryFormConfig,
        }),
        {
            cacheTime: Infinity,
            staleTime: Infinity,
            enabled: !!program
                && !!programId
                && !!optionSets
                && !!locale
                && !!minor
                && configIsFetched,
        },
    );

    return {
        formFoundation: programStage?.stageForm,
        stage: programStage,
    };
};
