// @flow
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';

export const useCurrentOrgUnitInfo = (): {| id: string, name: string, code: string |} =>
    useSelector(
        ({ currentSelections: { orgUnitId }, organisationUnits }) => ({
            id: orgUnitId,
            name: organisationUnits[orgUnitId]?.name,
            code: organisationUnits[orgUnitId]?.code,
        }),
        shallowEqual,
    );
