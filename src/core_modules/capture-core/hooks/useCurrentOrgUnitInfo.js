// @flow
import { useSelector } from 'react-redux';

export const useCurrentOrgUnitInfo = (): {|id: string|} =>
    ({ id: useSelector(({ currentSelections: { orgUnitId } }) => orgUnitId) })
    || {};
