// @flow
import { useMemo, useState, useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDataQuery } from '@dhis2/app-runtime';
import { getProgramAndStageForProgram, Section } from '../../../metaData';

export const useBuildFirstStageRegistration = (programId: string, skip: boolean = false) => {
    const [firstStage, setFirstStage] = useState();
    const [firstStageMetaData, setFirstStageMetadata] = useState();

    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: 'programs',
                    id: programId,
                    params: {
                        fields: 'useFirstStageDuringRegistration,programStages[sortOrder,id,access]',
                    },
                },
            }),
            [programId],
        ),
        { lazy: skip },
    );


    useEffect(() => {
        if (data?.program && data.program.useFirstStageDuringRegistration) {
            const { programStages } = data.program;
            // Get first stage that user has access to
            programStages.filter((stage) => {
                const access = {
                    read: stage.access.data.read,
                    write: stage.access.data.write,
                };
                return access.write;
            }).sort((a, b) => a.sortOrder - b.sortOrder);
            setFirstStage(programStages[0]?.id);
        }
    }, [data]);

    useEffect(() => {
        if (firstStage && programId) {
            const { stage } = getProgramAndStageForProgram(programId, firstStage);
            if (stage) {
                const section = stage.stageForm.getSection(Section.MAIN_SECTION_ID);
                section.name = i18n.t('Data Entry ({{ stageName }})', {
                    stageName: stage.name,
                });
                setFirstStageMetadata({
                    stage,
                });
            }
        }
    }, [firstStage, programId]);

    return { error, loading, firstStageMetaData };
};
