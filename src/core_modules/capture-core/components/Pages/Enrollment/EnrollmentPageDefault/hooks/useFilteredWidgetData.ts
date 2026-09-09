import { useSelector } from 'react-redux';
import { selectEnrollmentWidgetEffects } from '../../../common/EnrollmentOverviewDomain';

export const useFilteredWidgetData = () => useSelector(selectEnrollmentWidgetEffects);
