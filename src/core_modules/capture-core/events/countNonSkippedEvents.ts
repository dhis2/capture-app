import { statusTypes } from './statusTypes';

type EventLike = { programStage?: string; status: string };

// SKIPPED events do not occupy a non-repeatable stage slot on the backend,
// so they must be excluded when checking the "one event per stage" limit.
export const countNonSkippedEvents = (
    events: ReadonlyArray<EventLike> | undefined | null,
    stageId?: string,
): number => {
    if (!events) return 0;
    return events.filter(event =>
        event.status !== statusTypes.SKIPPED &&
        (stageId === undefined || event.programStage === stageId),
    ).length;
};
