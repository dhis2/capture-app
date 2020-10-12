// @flow
import { moment } from 'capture-core-utils/moment';
import isSelectionsEqual from '../../../../../App/isSelectionsEqual';

export function shouldSkipReload(
    programId: string,
    orgUnitId: string,
    categories: string,
    lastTransaction: number,
    listContext: ?Object,
) {
    if (!listContext) {
        return false;
    }

    const currentSelections = {
        programId,
        orgUnitId,
        categories,
    };

    // TODO: THIS FILE WILL BE REMOVED IN NEXT PR
    const {
        lastTransaction: contextLastTransaction,
        timestamp: contextTimestamp,
        programIdView: contextProgramId,
        orgUnitId: contextOrgUnitId,
        categories: contextCategories,
    } = listContext;

    if (!isSelectionsEqual(currentSelections, { programId: contextProgramId, orgUnitId: contextOrgUnitId, categories: contextCategories })) {
        return false;
    }

    if (lastTransaction > contextLastTransaction || moment().diff(moment(contextTimestamp), 'minutes') > 5) {
        return false;
    }

    return true;
}
