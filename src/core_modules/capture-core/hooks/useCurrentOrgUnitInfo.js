// @flow
import { useSelector } from 'react-redux';

export const useCurrentOrgUnitInfo = (): {| id: string, name: string |} =>
    (useSelector(({ currentSelections: { orgUnitId }, organisationUnits }) => organisationUnits[orgUnitId]))
    || {};
