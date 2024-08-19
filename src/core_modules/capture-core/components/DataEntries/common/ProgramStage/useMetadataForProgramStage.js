// @flow
import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import { useProgramFromIndexedDB } from '../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useUserLocale } from '../../../../utils/localeData/useUserLocale';
import { useDataEntryFormConfig, useOptionSetsForAttributes } from '../TEIAndEnrollment';
import { useDataElementsForStage } from './useDataElementsForStage';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { buildProgramStageMetadata } from './buildProgramStageMetadata';

type Props = {|
    programId: string,
    stageId?: string,
|}

type ReturnType = {|
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
    isLoading: boolean,
    isError: boolean,
|}

export const useMetadataForProgramStage = ({
    programId,
    stageId,
}: Props): ReturnType => {
    const scopeId = stageId || programId;
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });
    const { locale } = useUserLocale();
    const { serverVersion: { minor } } = useConfig();
    const { dataEntryFormConfig, configIsFetched } = useDataEntryFormConfig({ selectedScopeId: scopeId });

    const programStage = useMemo(() => {
        if (!stageId) {
            return program?.programStages[0];
        }

        return program?.programStages.find(ps => ps.id === stageId);
    }, [program?.programStages, stageId]);

    const dataElementIds = useMemo(() => {
        if (!programStage) return [];

        return programStage
            .programStageDataElements
            .map(dataElement => dataElement.dataElementId);
    }, [programStage]);

    const { dataElements } = useDataElementsForStage({
        programId,
        stageId,
        dataElementIds,
    });

    const { optionSets } = useOptionSetsForAttributes({
        attributes: dataElements,
        selectedScopeId: scopeId,
    });

    const { data: programStageMetadata, isIdle, isLoading, isError } = useIndexedDBQuery(
        // $FlowFixMe
        ['programStageMetadata', programId, stageId],
        // $FlowFixMe
        () => buildProgramStageMetadata({
            // $FlowFixMe
            cachedProgramStage: programStage,
            // $FlowFixMe
            cachedDataElements: dataElements,
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
                && !!dataElements
                && !!optionSets
                && !!locale
                && !!minor
                && configIsFetched,
        },
    );

    return {
        formFoundation: programStageMetadata?.stageForm,
        stage: programStageMetadata,
        isLoading: isLoading || isIdle,
        isError,
    };
};
