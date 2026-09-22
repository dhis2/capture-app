import { useCallback } from 'react';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { formatMomentEn } from 'capture-core-utils/date';

export const useServerFormattedNow = () => {
    const { fromClientDate } = useTimeZoneConversion();
    return useCallback(() => {
        const nowClient = fromClientDate(new Date());
        const nowServer = new Date(nowClient.getServerZonedISOString());
        return formatMomentEn(nowServer, 'YYYY-MM-DDTHH:mm:ss');
    }, [fromClientDate]);
};
