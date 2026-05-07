import React, { createContext, useContext, useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type ProgramAccess = { data?: { read?: boolean; write?: boolean } };

type ProgramAccessResponse = {
    access?: ProgramAccess;
    trackedEntityType?: {
        access?: ProgramAccess;
        displayName?: string;
        name?: string;
    };
    programStages?: Array<{ id?: string; access?: ProgramAccess }>;
};

export type EnrollmentAccessContextValue = {
    isLoading: boolean;
    error: any;
    programWriteAccess: boolean;
    trackedEntityTypeWriteAccess: boolean;
    programStageWriteAccess: boolean;
    programStageReadAccess: boolean;
    trackedEntityTypeName?: string;
    currentStageId?: string;
    currentStageWriteAccess: boolean;
    isEventPage: boolean;
    multipleStages: boolean;
    allWriteAccessMissing: boolean;
    hideWidgetBadge: boolean;
};

const fallback: EnrollmentAccessContextValue = {
    isLoading: false,
    error: undefined,
    programWriteAccess: true,
    trackedEntityTypeWriteAccess: true,
    programStageWriteAccess: true,
    programStageReadAccess: true,
    currentStageWriteAccess: true,
    isEventPage: false,
    multipleStages: false,
    allWriteAccessMissing: false,
    hideWidgetBadge: false,
};

const Context = createContext<EnrollmentAccessContextValue>(fallback);

type ProviderProps = {
    programId?: string;
    currentStageId?: string;
    children: React.ReactNode;
};

export const EnrollmentAccessProvider = ({ programId, currentStageId, children }: ProviderProps) => {
    const { loading, error, data } = useDataQuery(
        useMemo(() => ({
            program: {
                resource: `programs/${programId}`,
                params: {
                    fields: ['access,trackedEntityType[access,displayName,name],programStages[id,access]'],
                },
            },
        }), [programId]),
        { lazy: !programId } as any,
    );

    const value = useMemo<EnrollmentAccessContextValue>(() => {
        const program = data?.program as ProgramAccessResponse | undefined;
        const stages = program?.programStages ?? [];
        const programWriteAccess = Boolean(program?.access?.data?.write);
        const trackedEntityTypeWriteAccess = Boolean(program?.trackedEntityType?.access?.data?.write);
        const programStageWriteAccess = stages.some(s => s?.access?.data?.write);
        const programStageReadAccess = stages.some(s => s?.access?.data?.read);
        const isEventPage = Boolean(currentStageId);
        const currentStage = currentStageId
            ? stages.find(s => s?.id === currentStageId)
            : undefined;
        const currentStageWriteAccess = currentStage
            ? Boolean(currentStage.access?.data?.write)
            : true;
        const allWriteAccessMissing = !programWriteAccess
            && !trackedEntityTypeWriteAccess
            && !programStageWriteAccess;
        return {
            isLoading: loading,
            error,
            programWriteAccess,
            trackedEntityTypeWriteAccess,
            programStageWriteAccess,
            programStageReadAccess,
            trackedEntityTypeName:
                program?.trackedEntityType?.name ?? program?.trackedEntityType?.displayName,
            currentStageId,
            currentStageWriteAccess,
            isEventPage,
            multipleStages: stages.length > 1,
            allWriteAccessMissing,
            hideWidgetBadge: isEventPage || allWriteAccessMissing,
        };
    }, [loading, error, data, currentStageId]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useEnrollmentAccessContext = (): EnrollmentAccessContextValue => useContext(Context);
