import { createSelector } from 'reselect';
import log from 'loglevel';
import { getEventProgramThrowIfNotFound } from '../../../metaData';

const programIdSelector = (state: any) => state.currentSelections.programId;

export const makeProgramRulesSelector = () =>
    createSelector(
        programIdSelector,
        (programId: string) => {
            try {
                const program = getEventProgramThrowIfNotFound(programId);
                return program.programRules || [];
            } catch (error) {
                log.warn('Failed to get program rules:', error);
                return [];
            }
        },
    );
