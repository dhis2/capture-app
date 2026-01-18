import { createSelector } from 'reselect';
import { getTrackerProgramThrowIfNotFound, scopeTypes } from '../../metaData';
import { getScopeInfo } from '../../metaData/helpers/getScopeInfo';

type OwnProps = {
    dataEntryId: string;
    selectedScopeId: string;
};

export const makeProgramRulesSelector = () =>
    createSelector(
        (_state: any, { selectedScopeId }: OwnProps) => selectedScopeId,
        (selectedScopeId: string) => {
            try {
                const scopeInfo = getScopeInfo(selectedScopeId);
                if (scopeInfo?.scopeType === scopeTypes.TRACKER_PROGRAM) {
                    const program = getTrackerProgramThrowIfNotFound(selectedScopeId);
                    return program.programRules || [];
                }
                return [];
            } catch (error) {
                return [];
            }
        },
    );
