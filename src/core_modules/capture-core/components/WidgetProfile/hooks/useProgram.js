// @flow
import { useMemo } from 'react';
import { useApiProgram } from './useApiProgram';
import { useOptionGroups } from './useOptionGroups';

export const useProgram = (programId: string) => {
    const { error: programError, loading: programLoading, program } = useApiProgram(programId);
    const { error: optionGroupsError, loading: optionGroupsLoading, optionGroups } = useOptionGroups(program);

    const programMetadata = useMemo(() => {
        if (program && optionGroups) {
            if (program.trackedEntityType) {
                program.trackedEntityType.changelogEnabled = program.trackedEntityType.allowAuditLog;
                delete program.trackedEntityType.allowAuditLog;
            }
            program.programTrackedEntityAttributes = program.programTrackedEntityAttributes.map((attribute) => {
                const tea = attribute.trackedEntityAttribute;
                if (tea.optionSet) {
                    tea.optionSet.optionGroups = optionGroups[tea.optionSet.id];
                }
                return attribute;
            });
            return program;
        }
        return null;
    }, [program, optionGroups]);

    return {
        program: programMetadata,
        loading: programLoading || optionGroupsLoading,
        error: programError || optionGroupsError,
    };
};
