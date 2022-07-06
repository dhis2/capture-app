// @flow
import { useMemo } from 'react';
import { isSelectionsEqual } from '../../../App/isSelectionsEqual';
import type { Categories } from '../workingListsBase.types';

export const useIsContextInSync = (
    programId: string,
    categories?: Categories,
    viewContext: ?Object,
) => useMemo(() => {
    if (!viewContext) {
        return false;
    }

    const currentSelections = {
        programId,
        categories,
    };

    return isSelectionsEqual(currentSelections, viewContext);
}, [
    programId,
    categories,
    viewContext,
]);
