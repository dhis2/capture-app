// @flow
import { moment } from '../moment';

export const displayTypes = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
};

/**
 * Some locales are using numeral glyphs other than european. This method ensures the moment format method returns a value in european glyphs
 * @param {*} momentDate: the moment instance
 * @param {string} format: the moment format
 * @returns {string} A formatted string with european glyphs
 */
export function getFormattedStringFromMomentUsingEuropeanGlyphs(momentDate: moment$Moment, format: string) {
    const europeanMoment = momentDate.clone();
    europeanMoment.locale('en');
    return europeanMoment.format(format);
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
