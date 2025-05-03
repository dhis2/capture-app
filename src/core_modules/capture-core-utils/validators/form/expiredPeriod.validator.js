// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { dateUtils } from '../../../capture-core/rules/converters';


/* const useExpiredPeriod = ({ programId }) => {
    const { data, isLoading } = useApiMetadataQuery(
        ['programProtectionLevel', programId],
        {
            resource: 'programs',
            id: programId,
            params: {
                fields: 'expiryPeriodType,expiryDays',
            },
        },
        {
            enabled: !!programId,
        },
    );
    return {
        expiryPeriodType: data?.expiryPeriodType,
        expiryDays: data?.expiryDays,
        isLoading,
    };

} */

const program = {
    expiryPeriodType: 'MONTHLY',
    expiryDays: 3,
};

const isExpiredPeriod = (
    expiryPeriodType?: ?string,
    expiryDays: number,
    reportDate: string,
) => {
    const period = getFixedPeriodByDate({
        periodType: expiryPeriodType,
        date: reportDate,
        calendar: 'gregory',
        locale: 'en',
    });
    const today = dateUtils.getToday();
    const endDate = period.endDate;
    const expiryDate = dateUtils.addDays(endDate, expiryDays);
    const isTodayBeforeExpiryDate = dateUtils.compareDates(today, expiryDate) <= 0;

    return !isTodayBeforeExpiryDate;
};

export const isValidPeriod = (reportDate: string, props: Object) => {
    const { programId } = props;
    console.log('programId', programId);
    const { expiryPeriodType, expiryDays } = program;

    return isExpiredPeriod(expiryPeriodType, expiryDays, reportDate);
};
