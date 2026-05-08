import React, { createContext, useContext, useMemo } from 'react';
import type { TrackerProgram } from '../../../../../metaData';
import type { Access } from '../../../../../metaData/Access';

export type StageAccess = {
    canWrite: boolean;
    canRead: boolean;
};

export type EnrollmentAccessContextValue = {
    programWriteAccess: boolean;
    trackedEntityTypeWriteAccess: boolean;
    anyStageWriteAccess: boolean;
    anyStageReadAccess: boolean;
    stageWriteAccessById: Record<string, boolean>;
    stageReadAccessById: Record<string, boolean>;
    trackedEntityTypeName?: string;
    currentStageId?: string;
    currentStageWriteAccess: boolean;
    isEventPage: boolean;
    multipleStages: boolean;
    allWriteAccessMissing: boolean;
};

// Fail-open default for renders outside a provider (tests, plugin contexts).
const fallback: EnrollmentAccessContextValue = {
    programWriteAccess: true,
    trackedEntityTypeWriteAccess: true,
    anyStageWriteAccess: true,
    anyStageReadAccess: true,
    stageWriteAccessById: {},
    stageReadAccessById: {},
    currentStageWriteAccess: true,
    isEventPage: false,
    multipleStages: false,
    allWriteAccessMissing: false,
};

const Context = createContext<EnrollmentAccessContextValue>(fallback);

type ProviderProps = {
    program?: TrackerProgram;
    currentStageId?: string;
    children: React.ReactNode;
};

export const EnrollmentAccessProvider = ({ program, currentStageId, children }: ProviderProps) => {
    const value = useMemo<EnrollmentAccessContextValue>(() => {
        if (!program) return fallback;

        const stages = Array.from(program.stages.values());
        const stageWriteAccessById: Record<string, boolean> = {};
        const stageReadAccessById: Record<string, boolean> = {};
        for (const stage of stages) {
            const access = stage.access as Access | undefined;
            stageWriteAccessById[stage.id] = Boolean(access?.data?.write);
            stageReadAccessById[stage.id] = Boolean(access?.data?.read);
        }
        const programWriteAccess = Boolean(program.access?.data?.write);
        const trackedEntityTypeWriteAccess = Boolean(program.trackedEntityType?.access?.data?.write);
        const anyStageWriteAccess = Object.values(stageWriteAccessById).some(Boolean);
        const anyStageReadAccess = Object.values(stageReadAccessById).some(Boolean);
        const isEventPage = Boolean(currentStageId);
        const currentStageWriteAccess = currentStageId
            ? (stageWriteAccessById[currentStageId] ?? false)
            : true;
        const allWriteAccessMissing = !programWriteAccess
            && !trackedEntityTypeWriteAccess
            && !anyStageWriteAccess;

        return {
            programWriteAccess,
            trackedEntityTypeWriteAccess,
            anyStageWriteAccess,
            anyStageReadAccess,
            stageWriteAccessById,
            stageReadAccessById,
            trackedEntityTypeName: program.trackedEntityType?.name,
            currentStageId,
            currentStageWriteAccess,
            isEventPage,
            multipleStages: program.stages.size > 1,
            allWriteAccessMissing,
        };
    }, [program, currentStageId]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useEnrollmentAccessContext = (): EnrollmentAccessContextValue => useContext(Context);

// Resolves a stage's effective access. Falls back to the stage's own access
// data when the provider has no entry (plugin/test renders).
export const useStageAccess = (stage?: {
    id: string;
    access?: { data?: { write?: boolean; read?: boolean } };
    dataAccess?: { write?: boolean; read?: boolean };
}): StageAccess => {
    const { stageWriteAccessById, stageReadAccessById } = useContext(Context);
    return useMemo(() => {
        if (!stage) return { canWrite: true, canRead: true };
        const fromContextWrite = stageWriteAccessById[stage.id];
        const fromContextRead = stageReadAccessById[stage.id];
        return {
            canWrite: fromContextWrite ?? Boolean(stage.access?.data?.write ?? stage.dataAccess?.write),
            canRead: fromContextRead ?? Boolean(stage.access?.data?.read ?? stage.dataAccess?.read),
        };
    }, [stage, stageWriteAccessById, stageReadAccessById]);
};

// Page-level coordination: widget-level access badges are suppressed on the
// event page (where the page-level badge takes over) and when no write
// access is available anywhere (where the page-level "all missing" badge
// covers everything).
export const useShouldShowWidgetAccessBadge = (): boolean => {
    const { isEventPage, allWriteAccessMissing } = useContext(Context);
    return !isEventPage && !allWriteAccessMissing;
};
