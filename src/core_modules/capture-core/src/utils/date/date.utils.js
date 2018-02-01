// @flow
import moment from '../moment/momentResolver';

export const displayTypes = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
};

export function getMonthName(monthNumber: number) {
    const date = moment([0, monthNumber - 1]);
    return date.format('MMMM');
}

export function adjustUtcIsoDateToLocal(utcISO8601: string) {
    const localDate = moment(utcISO8601, 'YYYY-MM-DD');
    const isoString = localDate.toISOString();
    return isoString;
}

export function adjustLocalMomentDateToUtc(momentDateLocal: any) {
    const momentDateUTC = moment(Date.UTC(momentDateLocal.year(), momentDateLocal.month(), momentDateLocal.date()));
    return momentDateUTC;
}

export function adjustLocalIsoDateToUtc(localISO8601: string) {
    const momentLocale = moment(localISO8601);
    const momentUtc = adjustLocalMomentDateToUtc(momentLocale);
    return momentUtc.toISOString();
}

export const displayDate = (() => {
    const typeToMomentConverter = {
        [displayTypes.SHORT]: 'l',
        [displayTypes.MEDIUM]: 'L',
        [displayTypes.LONG]: 'LL',
    };

    return (ISOString: string | Date, displayType?: ?$Values<typeof displayTypes>) => {
        const date = moment(ISOString);
        return date.format((displayType && typeToMomentConverter[displayType]) || typeToMomentConverter[displayTypes.MEDIUM]);
    };
})();

export const displayDateTime = (() => {
    const typeToMomentConverter = {
        [displayTypes.SHORT]: 'LLL',
        [displayTypes.MEDIUM]: 'llll',
        [displayTypes.LONG]: 'LLLL',
    };

    return (ISOString: string | Date, displayType?: ?$Values<typeof displayTypes>) => {
        const date = moment(ISOString);
        return date.format((displayType && typeToMomentConverter[displayType]) || typeToMomentConverter[displayTypes.MEDIUM]);
    };
})();

export const displayTime = (() => {
    const typeToMomentConverter = {
        [displayTypes.SHORT]: 'LT',
        [displayTypes.MEDIUM]: 'LTS',
        [displayTypes.LONG]: 'LTS',
    };

    return (ISOString: string | Date, displayType?: ?$Values<typeof displayTypes>) => {
        const date = moment(ISOString);
        return date.format((displayType && typeToMomentConverter[displayType]) || typeToMomentConverter[displayTypes.MEDIUM]);
    };
})();

