import React, { createContext, useContext, useMemo } from 'react';
import type { TrackerProgram } from '../../../../../metaData';
import type { Access } from '../../../../../metaData/Access';

export type StageAccess = {
    canWrite?: boolean;
    canRead?: boolean;
};

export type EnrollmentAccessContextValue = {
    // Raw — kept for the rare case a consumer needs the underlying flag.
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
    hideWidgetBadge: boolean;

    // Semantic — what widgets should consume. Each is an "access read-only" flag,
    // separate from per-instance `readOnlyMode` (a layout/UX concern).
    enrollmentAccessReadOnly: boolean;
    notesAccessReadOnly: boolean;
    relationshipsAccessReadOnly: boolean;
    hideRelationshipNewButton: boolean;
    quickActionsHidden: boolean;
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
    hideWidgetBadge: false,
    enrollmentAccessReadOnly: false,
    notesAccessReadOnly: false,
    relationshipsAccessReadOnly: false,
    hideRelationshipNewButton: false,
    quickActionsHidden: false,
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
            hideWidgetBadge: isEventPage || allWriteAccessMissing,
            enrollmentAccessReadOnly: !programWriteAccess,
            notesAccessReadOnly: isEventPage ? !currentStageWriteAccess : !programWriteAccess,
            relationshipsAccessReadOnly: !trackedEntityTypeWriteAccess,
            hideRelationshipNewButton: !trackedEntityTypeWriteAccess || allWriteAccessMissing,
            quickActionsHidden: !anyStageWriteAccess,
        };
    }, [program, currentStageId]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useEnrollmentAccessContext = (): EnrollmentAccessContextValue => useContext(Context);

export const useStageAccess = (stageId?: string): StageAccess => {
    const { stageWriteAccessById, stageReadAccessById } = useContext(Context);
    return useMemo(() => {
        if (!stageId) return {};
        return {
            canWrite: stageWriteAccessById[stageId],
            canRead: stageReadAccessById[stageId],
        };
    }, [stageId, stageWriteAccessById, stageReadAccessById]);
};
