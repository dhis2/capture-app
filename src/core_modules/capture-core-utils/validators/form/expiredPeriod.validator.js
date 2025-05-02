// @flow
import {
    getFixedPeriodByDate,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates';


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
    expiryDays: 2,
};

const getExpiryDate = (
    expiryPeriodType?: ?string,
    expiryDays: number,
    reportDate: string,
): ?string => {
    console.log('reportDate', reportDate);

    const period = getFixedPeriodByDate({
        periodType: expiryPeriodType,
        date: reportDate,
        calendar: 'gregory',
        locale: 'en',
    });
    console.log('period', period);

    const startDate = convertToIso8601(period.startDate, 'gregory');
    console.log('startDate', startDate);
    const expiry = startDate.add({ days: expiryDays });


    console.log('expiryDate', expiry);


    return expiry;
};

export const isExpiredPeriod = (reportDate: string) => {
    const { expiryPeriodType, expiryDays } = program;
    const expiryDate = getExpiryDate(expiryPeriodType, expiryDays, reportDate);

    if (!expiryDate) {
        return false;
    }

    return true;
};
