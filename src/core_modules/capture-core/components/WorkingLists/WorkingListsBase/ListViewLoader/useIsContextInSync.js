// @flow
import { useMemo } from 'react';
import type { Categories } from '../workingListsBase.types';
import { isSelectionsEqual } from '../../../App/isSelectionsEqual';

export const useIsContextInSync = (
    programId: string,
    orgUnitId: string,
    categories?: Categories,
    viewContext: ?Object,
) => useMemo(() => {
    if (!viewContext) {
        return false;
    }

    const currentSelections = {
        programId,
        orgUnitId,
        categories,
    };

    return isSelectionsEqual(currentSelections, viewContext);
}, [
    programId,
    orgUnitId,
    categories,
    viewContext,
]);
