// @flow
import { useMemo } from 'react';
import isSelectionsEqual from '../../../../App/isSelectionsEqual';
import type { Categories } from '../workingLists.types';

export const useIsContextInSync = (
  programId: string,
  orgUnitId: string,
  categories?: Categories,
  viewContext: ?Object,
) =>
  useMemo(() => {
    if (!viewContext) {
      return false;
    }

    const currentSelections = {
      programId,
      orgUnitId,
      categories,
    };

    return isSelectionsEqual(currentSelections, viewContext);
  }, [programId, orgUnitId, categories, viewContext]);
