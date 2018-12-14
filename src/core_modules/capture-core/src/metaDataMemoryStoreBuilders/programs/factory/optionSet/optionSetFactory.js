// @flow
import type {
    CachedStyle,
    CachedOptionSet,
    CachedOptionSetTranslation,
    CachedOptionTranslation,
} from '../../../cache.types';
import { DataElement, OptionSet, Option, optionSetInputTypes as inputTypes, Icon } from '../../../../metaData';
import getCamelCaseUppercaseString from '../../../../utils/string/getCamelCaseFromUppercase';
import { convertOptionSetValue } from '../../../../converters/serverToClient';
import getDhisIconAsync from '../getDhisIcon';

const translationPropertyNames = {
    NAME: 'NAME',
    DESCRIPTION: 'DESCRIPTION',
    SHORT_NAME: 'SHORT_NAME',
};

let currentLocale: ?string;

function getTranslation(
    translations: Array<CachedOptionSetTranslation> | Array<CachedOptionTranslation>,
    property: $Values<typeof translationPropertyNames>,
) {
    if (currentLocale) {
        const translation = translations.find(t => t.property === property && t.locale === currentLocale);
        return translation && translation.value;
    }
    return null;
}

async function buildOptionIcon(cachedStyle: ?CachedStyle = {}) {
    const icon = cachedStyle && cachedStyle.icon;
    if (!icon) {
        return null;
    }

    try {
        const iconData = await getDhisIconAsync(icon);
        return new Icon((_this) => {
            // $FlowFixMe
            if (cachedStyle.color) {
                _this.color = cachedStyle.color;
            }
            _this.data = iconData;
        });
    } catch (error) {
        return null;
    }
}

function getRenderType(renderType: ?string) {
    return renderType && getCamelCaseUppercaseString(renderType);
}

export default async function buildOptionSet(
    cachedOptionSet: CachedOptionSet,
    dataElement: DataElement,
    renderOptionsAsRadio: ?boolean,
    renderType: ?string,
    onGetDataElementType: (valueType: string) => string,
    locale: ?string,
) {
    currentLocale = locale;
    dataElement.type = onGetDataElementType(cachedOptionSet.valueType);

    const optionsPromises = cachedOptionSet
        .options
        .map(async (cachedOption) => {
            const icon = await buildOptionIcon(cachedOption.style);

            return new Option((_this) => {
                _this.value = cachedOption.code;
                _this.text =
                    getTranslation(
                        cachedOption.translations,
                        translationPropertyNames.NAME) ||
                    cachedOption.displayName;
                _this.icon = icon;
            });
        });

    const options = await Promise.all(optionsPromises);

    const optionSet = new OptionSet(cachedOptionSet.id, options, dataElement, convertOptionSetValue);
    optionSet.inputType = getRenderType(renderType) || (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
    return optionSet;
}
