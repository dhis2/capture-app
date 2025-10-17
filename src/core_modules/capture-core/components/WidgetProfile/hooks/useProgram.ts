import { useMemo } from 'react';
import { useApiProgram } from './useApiProgram';
import { useOptionGroups } from './useOptionGroups';

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
    [key: string]: any;
};

export const useProgram = (programId: string) => {
    const { error: programError, loading: programLoading, program } = useApiProgram(programId);
    const { error: optionGroupsError, loading: optionGroupsLoading, optionGroups } = useOptionGroups(program);

    const programMetadata = useMemo(() => {
        if (program && optionGroups) {
            const typedProgram = program as ProgramType;
            if (typedProgram.trackedEntityType) {
                typedProgram.trackedEntityType.changelogEnabled = typedProgram.trackedEntityType.allowAuditLog;
                delete typedProgram.trackedEntityType.allowAuditLog;
            }
            typedProgram.programTrackedEntityAttributes = typedProgram.programTrackedEntityAttributes.map(
                (attribute: any) => {
                    const tea = attribute.trackedEntityAttribute;
                    if (tea.optionSet) {
                        tea.optionSet.optionGroups = optionGroups[tea.optionSet.id];
                    }
                    return attribute;
                });
            return typedProgram;
        }
        return null;
    }, [program, optionGroups]);

    return {
        program: programMetadata,
        loading: programLoading ?? optionGroupsLoading,
        error: programError ?? optionGroupsError,
    };
};
