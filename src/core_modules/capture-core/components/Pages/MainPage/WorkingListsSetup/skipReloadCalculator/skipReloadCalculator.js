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
        return {
            skipReloadTemplates: false,
            skipReloadData: false,
        };
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

    if (!isSelectionsEqual(currentSelections, listSelections)) {
        return {
            skipReloadTemplates: false,
            skipReloadData: false,
        };
    }

    if (lastTransaction > contextLastTransaction || moment().diff(moment(contextTimestamp), 'minutes') > 5) {
        return {
            skipReloadTemplates: true,
            skipReloadData: false,
        };
    }

    return {
        skipReloadTemplates: true,
        skipReloadData: true,
    };
}
