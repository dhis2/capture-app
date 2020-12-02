// @flow
import { useSelector } from 'react-redux';

export const useCurrentOrgUnitInfo = (): {|id: string, name: string, path: string|} =>
    useSelector((
        {
            organisationUnitRoots: { captureRoots: { roots } },
            currentSelections: { orgUnitId },
        }) => roots.find(({ id }) => id === orgUnitId))
    || {};
