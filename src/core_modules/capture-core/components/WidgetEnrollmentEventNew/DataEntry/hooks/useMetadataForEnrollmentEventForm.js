// @flow
import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { useProgramFromIndexedDB } from '../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import {
    useDataEntryFormConfig,
    useOptionSetsForAttributes,
} from '../../../DataEntries/common/TEIAndEnrollment';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { useDataElementsForStage, buildProgramStageMetadata } from '../../../DataEntries/common/ProgramStage';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import { useUserLocale } from '../../../../utils/localeData/useUserLocale';

type Props = {|
    programId: string,
    stageId: string,
|}

type ReturnType = {|
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
    isLoading: boolean,
    isError: boolean,
|}

export const useMetadataForEnrollmentEventForm = ({
    programId,
    stageId,
}: Props): ReturnType => {
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });
    const { dataEntryFormConfig, configIsFetched } = useDataEntryFormConfig({ selectedScopeId: stageId });
    const { locale } = useUserLocale();
    const { serverVersion: { minor } } = useConfig();

    const { programStage, dataElementIds } = useMemo(() => {
        const stage = program?.programStages.find(ps => ps.id === stageId);
        if (!stage) return {};

        return {
            programStage: stage,
            dataElementIds: stage
                .programStageDataElements
                .map(dataElement => dataElement.id),
        };
    }, [program, stageId]);

    const { dataElements } = useDataElementsForStage({
        programId,
        stageId,
        dataElementIds,
    });

    const { optionSets } = useOptionSetsForAttributes({
        attributes: dataElements,
        selectedScopeId: stageId,
    });

    const { data: programStageMetadata, isIdle, isLoading, isError } = useIndexedDBQuery(
        // $FlowFixMe
        ['formFoundation', programId, stageId],
        // $FlowFixMe
        () => buildProgramStageMetadata({
            // $FlowFixMe
            cachedProgramStage: programStage,
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
        formFoundation: programStageMetadata?.stageForm,
        stage: programStageMetadata,
        isLoading: isLoading || isIdle,
        isError,
    };
};
