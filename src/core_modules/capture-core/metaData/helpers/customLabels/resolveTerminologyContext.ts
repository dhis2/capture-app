import { getLocationQuery } from '../../../utils/routing';
import type { TerminologyContext } from './applyCustomTerminology';

type ReduxStore = { getState: () => unknown };

type DomainState = {
    viewEventPage?: {
        loadedValues?: {
            eventContainer?: { event?: { programId?: string, programStageId?: string } },
        },
    },
    enrollmentDomain?: {
        enrollment?: { program?: string },
    },
};

export const resolveTerminologyContext = (store: ReduxStore): TerminologyContext => {
    const query = getLocationQuery();

    if (query.programId) {
        return {
            programId: query.programId,
            stageId: query.stageId ?? query.programStageId,
        };
    }

    const state = (store.getState() ?? {}) as DomainState;

    if (query.eventId) {
        const event = state.viewEventPage?.loadedValues?.eventContainer?.event;
        if (event?.programId) {
            return { programId: event.programId, stageId: event.programStageId };
        }
    }

    if (query.enrollmentId || query.teiId) {
        const enrollment = state.enrollmentDomain?.enrollment;
        if (enrollment?.program) {
            return { programId: enrollment.program };
        }
    }

    return {};
};
