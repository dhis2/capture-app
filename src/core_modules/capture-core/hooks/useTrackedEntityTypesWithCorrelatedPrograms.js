// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { programCollection } from '../metaDataMemoryStores';
import { type Access, TrackerProgram, Section } from '../metaData';

type TrackedEntityTypesWithCorrelatedPrograms = $Exact<$ReadOnly<{
    [elementId: string]: {|
        +trackedEntityTypeId: string,
        +trackedEntityTypeAccess: Access,
        +trackedEntityTypeName: string,
        +programs: Array<{|
            +programName: string,
            +programId: string,
        |}>
    |}
}>
>
export const useTrackedEntityTypesWithCorrelatedPrograms = (): TrackedEntityTypesWithCorrelatedPrograms =>
    useMemo(() =>
        [...programCollection.values()]
            .filter(program => program instanceof TrackerProgram)
            // $FlowFixMe
            .reduce((acc, {
                id: programId,
                name: programName,
                trackedEntityType: {
                    id: trackedEntityTypeId,
                    access: trackedEntityTypeAccess,
                    name: trackedEntityTypeName,
                    searchGroups: trackedEntityTypeSearchGroups,
                    teiRegistration: { form, inputSearchGroups },
                },
                searchGroups,
                enrollment,
                stages,
                useFirstStageDuringRegistration,
            }: TrackerProgram) => {
                const accumulatedProgramsOfTrackedEntityType =
                  acc[trackedEntityTypeId] ? acc[trackedEntityTypeId].programs : [];
                const programMetadata = { programId, programName, searchGroups, enrollment };
                if (useFirstStageDuringRegistration) {
                    const firstStage = [...stages][0][1];
                    firstStage.stageForm.getSection(Section.MAIN_SECTION_ID).name = i18n.t('Data Entry ({{ stageName }})', {
                        stageName: firstStage.name,
                    });
                    // $FlowFixMe
                    programMetadata.firstStageForm = {
                        stageId: firstStage.id,
                        stageName: firstStage.name,
                        stageForm: firstStage.stageForm,
                    };
                }
                return {
                    ...acc,
                    [trackedEntityTypeId]: {
                        trackedEntityTypeId,
                        trackedEntityTypeAccess,
                        trackedEntityTypeName,
                        trackedEntityTypeSearchGroups,
                        trackedEntityTypeTeiRegistration: { form, inputSearchGroups },
                        programs: [
                            ...accumulatedProgramsOfTrackedEntityType,
                            { ...programMetadata },
                        ],

                    },
                };
            }, {}),
    [],
    );
