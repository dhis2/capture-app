import { useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withProgramTerminologyContext } from './programTerminologyContext';

/**
 * Returns a `t` function that applies terminology for the given program/stage
 * rather than the globally-selected program.
 *
 * Use this in React components that render data belonging to a program that
 * differs from the one currently selected in the URL/Redux state — e.g. a
 * relationships widget displaying events from a linked program.
 *
 *   const t = useProgramT(relationship.program.id);
 *   return <span>{t('New event')}</span>; // uses the linked program's label
 */
export const useProgramT = (
    programId: string | undefined,
    stageId?: string | undefined,
): ((key: string, options?: Record<string, unknown>) => string) =>
    useCallback(
        (key: string, options?: Record<string, unknown>) =>
            withProgramTerminologyContext({ programId, stageId }, () => i18n.t(key, options as any)),
        [programId, stageId],
    );
