// @flow
import { useSelector } from 'react-redux';

export const useCurrentOrgUnitInfo = (): {| id: string, name: string, code: string |} =>
    ({
        id: useSelector(({ currentSelections: { orgUnitId } }) => orgUnitId),
        name: useSelector((
            {
                organisationUnits,
                currentSelections: { orgUnitId },
            }) =>
            organisationUnits[orgUnitId] && organisationUnits[orgUnitId].name),
        code: useSelector((
            {
                organisationUnits,
                currentSelections: { orgUnitId },
            }) =>
            organisationUnits[orgUnitId] && organisationUnits[orgUnitId].code),
    });
