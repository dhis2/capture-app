// @flow
import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { useProgramFromIndexedDB } from '../../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useUserLocale } from '../../../../../utils/localeData/useUserLocale';
import { useIndexedDBQuery } from '../../../../../utils/reactQueryHelpers';
import type { ProgramStage, RenderFoundation } from '../../../../../metaData';
import { useDataElementsForStage, buildProgramStageMetadata } from '../../../common/ProgramStage';
import {
    useOptionSetsForAttributes,
    useDataEntryFormConfig,
} from '../../../common/TEIAndEnrollment';

type Props = {|
    programId: string,
|}

type ReturnType = {|
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
|}

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
        () => buildProgramStageMetadata({
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
