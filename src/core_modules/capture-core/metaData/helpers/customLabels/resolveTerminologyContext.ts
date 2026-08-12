import { getLocationQuery } from '../../../utils/routing';
import { getActiveProgramTerminologyContext } from './programTerminologyContext';
import type { TerminologyContext } from './applyCustomTerminology';

type ReduxStore = { getState: () => unknown };

type DomainState = {
    currentSelections?: { programId?: string },
    enrollmentDomain?: {
        enrollment?: { program?: string },
    },
};

export const resolveTerminologyContext = (store: ReduxStore): TerminologyContext => {
    // Explicit context wins — set by withProgramTerminologyContext for cross-program widgets.
    const explicit = getActiveProgramTerminologyContext();
    if (explicit !== undefined) return explicit;

    const state = (store.getState() ?? {}) as DomainState;
    const programId =
        state.currentSelections?.programId ||
        state.enrollmentDomain?.enrollment?.program;

    if (!programId) return {};

    // stageId is not stored in Redux; read from the URL so that displayEventLabel
    // overrides on tracker program stages apply on view/edit-event routes.
    const query = getLocationQuery();
    const stageId = query.stageId ?? query.programStageId;

    return stageId ? { programId, stageId } : { programId };
};
