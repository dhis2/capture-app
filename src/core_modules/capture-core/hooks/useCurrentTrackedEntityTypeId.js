// @flow
import { useSelector } from 'react-redux';

export const useCurrentTrackedEntityTypeId = () =>
  useSelector(({ currentSelections }) => currentSelections.trackedEntityTypeId);
