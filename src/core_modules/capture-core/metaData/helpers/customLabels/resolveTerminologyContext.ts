import { getLocationQuery } from '../../../utils/routing';
import type { TerminologyContext } from './applyCustomTerminology';

type ReduxStore = { getState: () => unknown };

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

export const resolveTerminologyContext = (store: ReduxStore): TerminologyContext => {
    const query = getLocationQuery();

    if (query.programId) {
        return {
            programId: query.programId,
            stageId: query.stageId ?? query.programStageId,
        };
    }

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

    return {};
};
