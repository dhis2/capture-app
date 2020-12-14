// @flow
import { useSelector } from 'react-redux';

export const useCurrentTrackedProgramId = () => useSelector(({ currentSelections }) => currentSelections.programId);
