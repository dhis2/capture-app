// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import type {
    CachedAttributeTranslation,
    CachedTrackedEntityTypeAttribute,
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../cache.types';
import { DataElement } from '../../../../metaData';
import { OptionSetFactory } from '../../../common/factory';
import errorCreator from '../../../../utils/errorCreator';

class DataElementFactory {
    static translationPropertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
    };

    static errorMessages = {
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'Tracked entity attribute not found',
    };

    locale: ?string;
    optionSetFactory: OptionSetFactory;
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
    ) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.locale = locale;
        this.optionSetFactory = new OptionSetFactory(
            cachedOptionSets,
            locale,
        );
    }

    _getAttributeTranslation(
        translations: Array<CachedAttributeTranslation>,
        property: $Values<typeof DataElementFactory.translationPropertyNames>,
    ) {
        if (this.locale) {
            const translation = translations.find(t => t.property === property && t.locale === this.locale);
            return translation && translation.value;
        }
        return null;
    }

    async build(
        cachedTrackedEntityTypeAttribute: CachedTrackedEntityTypeAttribute,
    ) {
        const cachedAttribute = cachedTrackedEntityTypeAttribute.trackedEntityAttributeId &&
            this.cachedTrackedEntityAttributes.get(
                cachedTrackedEntityTypeAttribute.trackedEntityAttributeId,
            );

        if (!cachedAttribute) {
            log.error(
                errorCreator(
                    DataElementFactory.errorMessages.TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)(
                    { cachedTrackedEntityTypeAttribute }));
            return null;
        }

        const dataElement = new DataElement((_this) => {
            _this.id = cachedAttribute.id;
            _this.compulsory = cachedTrackedEntityTypeAttribute.mandatory;
            _this.name =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.NAME) ||
                    cachedAttribute.displayName;
            _this.shortName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.SHORT_NAME) ||
                    cachedAttribute.displayShortName;
            _this.formName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.NAME) ||
                    cachedAttribute.displayName;
            _this.description =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.DESCRIPTION) ||
                    cachedAttribute.description;
            _this.displayInForms = true;
            _this.displayInReports = cachedTrackedEntityTypeAttribute.displayInList;
            _this.disabled = false;
            _this.type = cachedAttribute.valueType;
        });

        if (cachedAttribute.optionSet && cachedAttribute.optionSet.id) {
            dataElement.optionSet = await this.optionSetFactory.build(
                dataElement,
                cachedAttribute.optionSet.id,
                cachedTrackedEntityTypeAttribute.renderOptionsAsRadio,
                null,
                value => value,
            );
        }

        return dataElement;
    }
}

export default DataElementFactory;
