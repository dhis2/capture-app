import { getLocationQuery } from '../../../utils/routing';
import type { TerminologyContext } from './applyCustomTerminology';

type StoreLike = { getState: () => unknown };

type DomainState = {
    viewEventPage?: {
        loadedValues?: {
            eventContainer?: { event?: { program?: string, programStage?: string } },
        },
    },
    enrollmentDomain?: {
        enrollment?: { program?: string },
    },
};

/**
 * Layered resolution of the "current view's program" for terminology substitution.
 *   1. URL query — most program-scoped pages carry programId directly (enrollment
 *      dashboard, working lists, new enrollment, etc.).
 *   2. Redux domain state — pages that carry only entity ids (event edit's eventId,
 *      viewEvent's viewEventId, TEI dashboard's teiId) resolve program via the
 *      loaded entity.
 *   3. Nothing — English fallback. Never touches state.currentSelections, which is
 *      the top-nav scope filter and can diverge from the entity actually on screen.
 */
export const resolveTerminologyContext = (store: StoreLike): TerminologyContext => {
    const query = getLocationQuery();

    // Layer 1: URL
    if (query.programId) {
        return {
            programId: query.programId,
            stageId: query.stageId ?? query.programStageId,
            trackedEntityTypeId: query.trackedEntityTypeId,
        };
    }

    // Layer 2: Redux domain state
    const state = (store.getState() ?? {}) as DomainState;

    if (query.eventId || query.viewEventId) {
        const event = state.viewEventPage?.loadedValues?.eventContainer?.event;
        if (event?.program) {
            return { programId: event.program, stageId: event.programStage };
        }
    }

    if (query.enrollmentId || query.teiId) {
        const enrollment = state.enrollmentDomain?.enrollment;
        if (enrollment?.program) {
            return { programId: enrollment.program };
        }
    }

    // Layer 3: no context — postProcessor will leave the string untouched.
    return {};
};
