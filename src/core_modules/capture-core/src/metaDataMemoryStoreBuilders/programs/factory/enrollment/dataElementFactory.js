// @flow
import log from 'loglevel';
import errorCreator from '../../../../utils/errorCreator';
import type {
    CachedAttributeTranslation,
    CachedProgramTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../cache.types';
import { DataElement } from '../../../../metaData';
import { buildOptionSet } from '../optionSet';

const translationPropertyNames = {
    NAME: 'NAME',
    DESCRIPTION: 'DESCRIPTION',
    SHORT_NAME: 'SHORT_NAME',
};

const errorMessages = {
    OPTION_SET_NOT_FOUND: 'Option set not found',
};

let currentLocale: ?string;

function getAttributeTranslation(
    translations: Array<CachedAttributeTranslation>,
    property: $Values<typeof translationPropertyNames>,
) {
    if (currentLocale) {
        const translation = translations.find(t => t.property === property && t.locale === currentLocale);
        return translation && translation.value;
    }
    return null;
}

export default async function buildElement(
    programTrackedEntityAttribute: CachedProgramTrackedEntityAttribute,
    cachedOptionSets: ?Array<CachedOptionSet>,
    locale: ?string,
) {
    currentLocale = locale;
    const attribute = programTrackedEntityAttribute.trackedEntityAttribute;

    const dataElement = new DataElement((_this) => {
        _this.id = attribute.id;
        _this.compulsory = programTrackedEntityAttribute.mandatory;
        _this.name =
            getAttributeTranslation(attribute.translations, translationPropertyNames.NAME) || attribute.displayName;
        _this.shortName =
            getAttributeTranslation(attribute.translations, translationPropertyNames.SHORT_NAME) ||
            attribute.displayShortName;
        _this.formName =
            getAttributeTranslation(attribute.translations, translationPropertyNames.NAME) || attribute.displayName;
        _this.description =
            getAttributeTranslation(attribute.translations, translationPropertyNames.DESCRIPTION) ||
            attribute.description;
        _this.displayInForms = true;
        _this.displayInReports = programTrackedEntityAttribute.displayInList;
        _this.disabled = false;
        _this.type = attribute.valueType;
    });

    if (attribute.optionSet && attribute.optionSet.id) {
        const cachedOptionSet = cachedOptionSets && cachedOptionSets.find(d2Os => d2Os.id === attribute.optionSet.id);
        if (!cachedOptionSet) {
            log.warn(
                errorCreator(errorMessages.OPTION_SET_NOT_FOUND)(
                    { id: attribute.optionSet.id, method: 'buildElement', context: 'enrollment' }),
            );
        } else {
            dataElement.optionSet = await buildOptionSet(
                cachedOptionSet,
                dataElement,
                programTrackedEntityAttribute.renderOptionsAsRadio,
                null,
                value => value,
                locale,
            );
        }
    }

    return dataElement;
}
