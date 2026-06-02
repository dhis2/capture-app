import React, { createContext, useContext, useMemo } from 'react';
import type { TrackerProgram } from '../../../../../metaData';
import type { Access } from '../../../../../metaData/Access';

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
    showWidgetBadge: boolean;
    isEventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
};

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
    showWidgetBadge: true,
};

const Context = createContext<EnrollmentAccessContextValue>(fallback);

type ProviderProps = {
    program?: TrackerProgram;
    currentStageId?: string;
    isEventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
    children: React.ReactNode;
};

export const EnrollmentAccessProvider = ({
    program,
    currentStageId,
    isEventWithinValidPeriod,
    canEditCompletedEvent,
    children,
}: ProviderProps) => {
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
            showWidgetBadge: !isEventPage && !allWriteAccessMissing,
            isEventWithinValidPeriod,
            canEditCompletedEvent,
        };
    }, [program, currentStageId, isEventWithinValidPeriod, canEditCompletedEvent]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useEnrollmentAccessContext = (): EnrollmentAccessContextValue => useContext(Context);
