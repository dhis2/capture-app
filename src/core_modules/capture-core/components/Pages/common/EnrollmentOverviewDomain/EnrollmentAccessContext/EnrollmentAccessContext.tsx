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
    trackedEntityInactive: boolean;
    canToggleTrackedEntityStatus: boolean;
    isEventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
    isWithinCompleteEventsExpiry?: boolean;
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
    trackedEntityInactive: false,
    canToggleTrackedEntityStatus: false,
};

const Context = createContext<EnrollmentAccessContextValue>(fallback);

type ProviderProps = {
    program?: TrackerProgram;
    currentStageId?: string;
    trackedEntityInactive?: boolean;
    isEventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
    isWithinCompleteEventsExpiry?: boolean;
    children: React.ReactNode;
};

const buildStageAccessMaps = (program: TrackerProgram) => {
    const rawStageWriteAccessById: Record<string, boolean> = {};
    const stageReadAccessById: Record<string, boolean> = {};
    for (const stage of program.stages.values()) {
        const access = stage.access as Access | undefined;
        rawStageWriteAccessById[stage.id] = Boolean(access?.data?.write);
        stageReadAccessById[stage.id] = Boolean(access?.data?.read);
    }
    return { rawStageWriteAccessById, stageReadAccessById };
};

const computeContextValue = (
    program: TrackerProgram,
    currentStageId: string | undefined,
    trackedEntityInactive: boolean,
    isEventWithinValidPeriod?: boolean,
    canEditCompletedEvent?: boolean,
    isWithinCompleteEventsExpiry?: boolean,
): EnrollmentAccessContextValue => {
    const { rawStageWriteAccessById, stageReadAccessById } = buildStageAccessMaps(program);
    const rawProgramWriteAccess = Boolean(program.access?.data?.write);
    const rawTrackedEntityTypeWriteAccess = Boolean(program.trackedEntityType?.access?.data?.write);

    const stageWriteAccessById = trackedEntityInactive
        ? Object.fromEntries(Object.keys(rawStageWriteAccessById).map(id => [id, false]))
        : rawStageWriteAccessById;
    const programWriteAccess = !trackedEntityInactive && rawProgramWriteAccess;
    const trackedEntityTypeWriteAccess = !trackedEntityInactive && rawTrackedEntityTypeWriteAccess;
    const anyStageWriteAccess = Object.values(stageWriteAccessById).some(Boolean);
    const anyStageReadAccess = Object.values(stageReadAccessById).some(Boolean);
    const isEventPage = Boolean(currentStageId);
    const currentStageWriteAccess = currentStageId ? (stageWriteAccessById[currentStageId] ?? false) : true;
    const allWriteAccessMissing = !programWriteAccess && !trackedEntityTypeWriteAccess && !anyStageWriteAccess;

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
        trackedEntityInactive,
        canToggleTrackedEntityStatus: rawTrackedEntityTypeWriteAccess,
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        isWithinCompleteEventsExpiry,
    };
};

export const EnrollmentAccessProvider = ({
    program,
    currentStageId,
    trackedEntityInactive = false,
    isEventWithinValidPeriod,
    canEditCompletedEvent,
    isWithinCompleteEventsExpiry,
    children,
}: ProviderProps) => {
    const value = useMemo<EnrollmentAccessContextValue>(
        () => (program
            ? computeContextValue(
                program,
                currentStageId,
                trackedEntityInactive,
                isEventWithinValidPeriod,
                canEditCompletedEvent,
                isWithinCompleteEventsExpiry,
            )
            : {
                ...fallback,
                trackedEntityInactive,
                ...(trackedEntityInactive && {
                    programWriteAccess: false,
                    trackedEntityTypeWriteAccess: false,
                    anyStageWriteAccess: false,
                    currentStageWriteAccess: false,
                    allWriteAccessMissing: true,
                    showWidgetBadge: false,
                }),
            }),
        [
            program,
            currentStageId,
            trackedEntityInactive,
            isEventWithinValidPeriod,
            canEditCompletedEvent,
            isWithinCompleteEventsExpiry,
        ],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useEnrollmentAccessContext = (): EnrollmentAccessContextValue => useContext(Context);
