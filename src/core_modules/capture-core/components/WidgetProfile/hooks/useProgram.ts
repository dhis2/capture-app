import { useMemo } from 'react';
import { useApiProgram } from './useApiProgram';
import { useOptionGroups } from './useOptionGroups';

type TrackedEntityType = {
    changelogEnabled?: boolean;
    allowAuditLog?: boolean;
    [key: string]: any;
};

type TrackedEntityAttribute = {
    optionSet?: {
        id: string;
        optionGroups?: any;
        [key: string]: any;
    };
    [key: string]: any;
};

type ProgramAttribute = {
    trackedEntityAttribute: TrackedEntityAttribute;
    [key: string]: any;
};

type Program = {
    trackedEntityType?: TrackedEntityType;
    programTrackedEntityAttributes: ProgramAttribute[];
    access?: {
        data?: {
            write?: boolean;
        };
    };
    [key: string]: any;
};

type ProgramReturnType = {
    program: Program | null;
    loading: boolean;
    error?: any;
};

export const useProgram = (programId: string): ProgramReturnType => {
    const { error: programError, loading: programLoading, program } = useApiProgram(programId);
    const { error: optionGroupsError, loading: optionGroupsLoading, optionGroups } = useOptionGroups(program);

    const programMetadata = useMemo(() => {
        if (program && optionGroups) {
            const typedProgram = program as Program;
            
            if (typedProgram.trackedEntityType) {
                typedProgram.trackedEntityType.changelogEnabled = typedProgram.trackedEntityType.allowAuditLog;
                delete typedProgram.trackedEntityType.allowAuditLog;
            }
            
            typedProgram.programTrackedEntityAttributes = typedProgram.programTrackedEntityAttributes.map((attribute) => {
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
        loading: programLoading || optionGroupsLoading,
        error: programError || optionGroupsError,
    };
};
