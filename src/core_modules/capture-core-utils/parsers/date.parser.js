// @flow
import moment from 'capture-core-utils/moment/momentResolver';

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
    // $FlowFixMe[incompatible-type] automated comment
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

function parseWithoutSeparator(dateString: string, localeFormat: string, separatorPattern: RegExp) {
    const dateStringWithoutSeparator = dateString.replace(separatorPattern, '');
    const localeFormatWithoutSeparator = localeFormat.replace(separatorPattern, '');

    const momentDate = moment(dateStringWithoutSeparator, localeFormatWithoutSeparator, true);
    if (momentDate.isValid()) {
        return getReturnObject(momentDate);
    }

    return getReturnObject(null);
}

export default function parseDate(dateString: string, format: string) {
    const separatorPattern = /[.,\-_/\\]/g;
    if (separatorPattern.test(dateString) && separatorPattern.test(format)) {
        return parseWithSeparator(dateString, format, separatorPattern);
    }

    return parseWithoutSeparator(dateString, format, separatorPattern);
}
