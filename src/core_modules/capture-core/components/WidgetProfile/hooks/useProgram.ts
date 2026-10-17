import { useMemo } from 'react';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { useApiProgram } from './useApiProgram';
import { useOptionGroups } from './useOptionGroups';

type ApiProgram = {
    trackedEntityType: {
        allowAuditLog: boolean;
        enableChangeLog?: boolean;
        [key: string]: any;
    };
    programTrackedEntityAttributes: Array<{
        trackedEntityAttribute: {
            optionSet?: {
                id: string;
                [key: string]: any;
            };
            access: {
                read: boolean
            };
            [key: string]: any;
        };
        [key: string]: any;
    }>;
    [key: string]: any;
};

type Program = {
    trackedEntityType: {
        changelogEnabled: boolean;
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

    const programMetadata: Program | null = useMemo(() => {
        if (program && optionGroups) {
            const apiProgram = program as ApiProgram;
            const { allowAuditLog, enableChangeLog, ...restTrackedEntityType } = apiProgram.trackedEntityType;

            return {
                ...apiProgram,
                trackedEntityType: {
                    ...restTrackedEntityType,
                    changelogEnabled: featureAvailable(FEATURES.enableChangeLog)
                        ? Boolean(enableChangeLog)
                        : allowAuditLog,
                },
                programTrackedEntityAttributes: apiProgram.programTrackedEntityAttributes
                    .filter(programTrackedEntityAttribute =>
                        programTrackedEntityAttribute.trackedEntityAttribute.access.read)
                    .map((programTrackedEntityAttribute) => {
                        const { access: _, ...restTrackedEntityAttribute } =
                            programTrackedEntityAttribute.trackedEntityAttribute;

                        if (restTrackedEntityAttribute.optionSet) {
                            const originalOptionSet = restTrackedEntityAttribute.optionSet;
                            const optionSet = {
                                ...originalOptionSet,
                                optionGroups: optionGroups[originalOptionSet.id],
                            };
                            return {
                                ...programTrackedEntityAttribute,
                                trackedEntityAttribute: {
                                    ...restTrackedEntityAttribute,
                                    optionSet,
                                },
                            };
                        }
                        return {
                            ...programTrackedEntityAttribute,
                            trackedEntityAttribute: restTrackedEntityAttribute,
                        };
                    }),
            };
        }
        return null;
    }, [program, optionGroups]);

    return {
        program: programMetadata,
        loading: programLoading ?? optionGroupsLoading,
        error: programError ?? optionGroupsError,
    };
};
