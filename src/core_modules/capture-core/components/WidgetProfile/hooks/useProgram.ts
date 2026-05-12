import { useMemo } from 'react';
import { useApiProgram } from './useApiProgram';
import { useOptionGroups } from './useOptionGroups';
import { useOptionSets } from './useOptionSets';

type ProgramType = {
    trackedEntityType?: {
        allowAuditLog?: boolean;
        changelogEnabled?: boolean;
        [key: string]: any;
    };
    programTrackedEntityAttributes: Array<{
        trackedEntityAttribute: {
            optionSet?: {
                id: string;
                [key: string]: any;
            };
            [key: string]: any;
        };
        [key: string]: any;
    }>;
    programStages?: Array<{
        programStageDataElements?: Array<{
            dataElement?: {
                optionSet?: {
                    id: string;
                    [key: string]: any;
                };
                [key: string]: any;
            };
            [key: string]: any;
        }>;
        [key: string]: any;
    }>;
    [key: string]: any;
};

const hydrateOptionSet = (
    optionSet: { id: string; [key: string]: any } | undefined,
    fullOptionSets: { [id: string]: any },
) => {
    if (!optionSet) return optionSet;
    const full = fullOptionSets[optionSet.id];
    if (!full) return optionSet;
    return { ...optionSet, ...full };
};

export const useProgram = (programId: string) => {
    const { error: programError, loading: programLoading, program } = useApiProgram(programId);
    const { error: optionGroupsError, loading: optionGroupsLoading, optionGroups } = useOptionGroups(program);
    const { error: optionSetsError, loading: optionSetsLoading, optionSets } = useOptionSets(program);

    const programMetadata = useMemo(() => {
        if (program && optionGroups && optionSets) {
            const typedProgram = program as ProgramType;
            if (typedProgram.trackedEntityType) {
                typedProgram.trackedEntityType.changelogEnabled = typedProgram.trackedEntityType.allowAuditLog;
                delete typedProgram.trackedEntityType.allowAuditLog;
            }

            typedProgram.programTrackedEntityAttributes = typedProgram.programTrackedEntityAttributes.map(
                (attribute: any) => {
                    const tea = attribute.trackedEntityAttribute;
                    if (tea.optionSet) {
                        tea.optionSet = hydrateOptionSet(tea.optionSet, optionSets);
                        tea.optionSet.optionGroups = optionGroups[tea.optionSet.id];
                    }
                    return attribute;
                });

            typedProgram.programStages?.forEach((stage: any) => {
                stage.programStageDataElements?.forEach((psde: any) => {
                    if (psde.dataElement?.optionSet) {
                        psde.dataElement.optionSet = hydrateOptionSet(psde.dataElement.optionSet, optionSets);
                    }
                });
            });

            return typedProgram;
        }
        return null;
    }, [program, optionGroups, optionSets]);

    return {
        program: programMetadata,
        loading: programLoading || optionGroupsLoading || optionSetsLoading,
        error: programError ?? optionGroupsError ?? optionSetsError,
    };
};
