import { useSelector } from 'react-redux';

export const useCurrentTrackedEntityTypeId = () =>
    useSelector(({ currentSelections }: any) => currentSelections.trackedEntityTypeId);
