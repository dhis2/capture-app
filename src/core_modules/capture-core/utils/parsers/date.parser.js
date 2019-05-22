// @flow
/* eslint-disable complexity */
import log from 'loglevel';
import moment from '../../utils/moment/momentResolver';

const getReturnObject = (momentDate: ?moment$Moment) => ({
    momentDate,
    isValid: momentDate ? momentDate.isValid() : false,
});

function manipulateFormatAndParseWithSeparator(dateString: string, inputFormat: string, separator: string) {
    const dateSplitted = dateString.split(separator);
    const formatSplitted = inputFormat.split(separator);
    if (dateSplitted.length === formatSplitted.length) {
        const newLocaleFormat = formatSplitted
            .map((formatPart, index) => {
                let newFormatPart = '';
                const datePart = dateSplitted[index];
                if (formatPart && datePart) {
                    const partKey = formatPart.charAt(0);
                    if (partKey === 'M') {
                        if (datePart.length === 1) {
                            newFormatPart = 'M';
                        } else if (datePart.length === 2) {
                            newFormatPart = 'MM';
                        }
                    } else if (partKey === 'D') {
                        if (datePart.length === 1) {
                            newFormatPart = 'D';
                        } else if (datePart.length === 2) {
                            newFormatPart = 'DD';
                        }
                    } else if (partKey === 'Y') {
                        if (datePart.length === 2) {
                            newFormatPart = 'YY';
                        } else if (datePart.length === 4) {
                            newFormatPart = 'YYYY';
                        }
                    }
                }
                return newFormatPart || formatPart;
            })
            .join(separator);
        const momentDate = moment(dateString, newLocaleFormat, true);
        return getReturnObject(momentDate);
    }

    return getReturnObject(null);
}

function parseWithSeparator(dateString: string, localeFormat: string, separatorPattern: RegExp) {
    const specialCharactersInLocaleFormat = localeFormat.match(separatorPattern);
    // $FlowSuppress prechecked
    const separator: string = specialCharactersInLocaleFormat && specialCharactersInLocaleFormat[0];
    const dateStringWithLocaleSeparator = dateString.replace(separatorPattern, separator);
    const localeFormatSameSeparator = localeFormat.replace(separatorPattern, separator);

    const momentDate = moment(dateStringWithLocaleSeparator, localeFormatSameSeparator, true);
    if (momentDate.isValid()) {
        return getReturnObject(momentDate);
    }

    const parseData = manipulateFormatAndParseWithSeparator(
        dateStringWithLocaleSeparator,
        localeFormatSameSeparator,
        separator,
    );
    return parseData;
}

function manipulateDayOrMonthInFormat(format: string, key: string) { // eslint-disable-line
    const stringPattern = `${key}+`;
    const matchPattern = new RegExp(stringPattern);
    const partMatches = format.match(matchPattern);
    const part = partMatches && partMatches[0];

    let manipulatedFormat = format;
    if (part) {
        let newPart;
        switch (part.length) {
        case 1:
            newPart = key + key;
            break;
        case 2:
            newPart = key;
            break;
        default:
            break;
        }
        if (newPart) {
            manipulatedFormat = format.replace(part, newPart);
        }
    }
    return manipulatedFormat;
}

function manipulateFormatAndParseWithoutSeparator(dateString: string, localeFormat: string) { // eslint-disable-line
    // rejecting this for now, didn't work as expected. Need to look into it more.
    return getReturnObject(null);

    /*
    this didn't work as expected
    const manipulatedDayFormat = manipulateDayOrMonthInFormat(localeFormat, 'D');
    if (manipulatedDayFormat !== localeFormat) {
        const dateDayManipulated = moment(dateString, manipulatedDayFormat, true);
        if (dateDayManipulated.isValid()) {
            return getReturnObject(dateDayManipulated);
        }
    }

    const manipulatedMonthFormat = manipulateDayOrMonthInFormat(localeFormat, 'M');
    if (manipulatedMonthFormat !== localeFormat) {
        const dateMonthManipulated = moment(dateString, manipulatedMonthFormat, true);
        if (dateMonthManipulated.isValid()) {
            return getReturnObject(dateMonthManipulated);
        }
    }

    if (manipulatedDayFormat !== localeFormat && manipulatedMonthFormat !== localeFormat) {
        const manipulatedFormat = manipulateDayOrMonthInFormat(manipulatedDayFormat, 'M');
        const dateManipulated = moment(dateString, manipulatedFormat, true);
        if (dateManipulated.isValid()) {
            return getReturnObject(dateManipulated);
        }
    }

    return getReturnObject(null);
    */
}

function parseWithoutSeparator(dateString: string, localeFormat: string, separatorPattern: RegExp) {
    const dateStringWithoutSeparator = dateString.replace(separatorPattern, '');
    const localeFormatWithoutSeparator = localeFormat.replace(separatorPattern, '');

    const momentDate = moment(dateStringWithoutSeparator, localeFormatWithoutSeparator, true);
    if (momentDate.isValid()) {
        return getReturnObject(momentDate);
    }

    return manipulateFormatAndParseWithoutSeparator(dateStringWithoutSeparator, localeFormatWithoutSeparator);
}

export default function parseDate(dateString: string) {
    // $FlowSuppress
    const localeFormat = moment.localeData()._longDateFormat.L; //eslint-disable-line

    if (!localeFormat) {
        // $FlowSuppress
        log.error(`could not get locale format for ${moment.locale()}`);
        return getReturnObject(null);
    }

    const separatorPattern = /[^\w\s]/g;
    if (separatorPattern.test(dateString) && separatorPattern.test(localeFormat)) {
        return parseWithSeparator(dateString, localeFormat, separatorPattern);
    }

    return parseWithoutSeparator(dateString, localeFormat, separatorPattern);
}
