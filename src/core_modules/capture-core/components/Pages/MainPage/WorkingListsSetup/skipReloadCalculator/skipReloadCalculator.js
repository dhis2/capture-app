// @flow
import { moment } from 'capture-core-utils/moment';
import isSelectionsEqual from '../../../../App/isSelectionsEqual';

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

    const {
        lastTransaction: contextLastTransaction,
        timestamp: contextTimestamp,
        ...listSelections
    } = listContext;

    if (lastTransaction > contextLastTransaction) {
        return false;
    }

    if (!isSelectionsEqual(currentSelections, listSelections)) {
        return false;
    }

    return moment().diff(moment(contextTimestamp), 'minutes') < 5;
}
