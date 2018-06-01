// @flow
import log from 'loglevel';
import format from '../utils/string/format';
import { formatterOptions } from '../utils/string/format.const';

let d2Instance: D2;

export function setD2(d2: D2) {
    d2Instance = d2;
}

const getD2 = () => {
    if (!d2Instance) {
        log.error('please set d2 before using it');
    }
    return d2Instance;
};

export const getTranslation = (text: string, formatterOption?: $Values<typeof formatterOptions>) => {
    const translatedText = getD2().i18n.getTranslation(text);

    if (formatterOption && translatedText && translatedText.charAt(0) !== '*') {
        return format(translatedText, formatterOption);
    }

    return translatedText;
};

export const getApi = () => getD2().Api.getApi();

export const getModels = () => getD2().models;


export default getD2;
