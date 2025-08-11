import { useSelector } from 'react-redux';

export const useCurrentOrgUnitId = () =>
    useSelector(({ currentSelections: { orgUnitId } }: any) => orgUnitId);
