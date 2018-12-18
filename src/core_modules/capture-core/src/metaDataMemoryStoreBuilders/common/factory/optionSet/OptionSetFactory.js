// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import type {
    CachedStyle,
    CachedOptionSet,
    CachedOptionSetTranslation,
    CachedOptionTranslation,
} from '../../../cache.types';
import { DataElement, OptionSet, Option, optionSetInputTypes as inputTypes, Icon } from '../../../../metaData';
import getCamelCaseUppercaseString from '../../../../utils/string/getCamelCaseFromUppercase';
import { convertOptionSetValue } from '../../../../converters/serverToClient';
import getDhisIconAsync from '../../getDhisIcon';
import errorCreator from '../../../../utils/errorCreator';

class OptionSetFactory {
    static OPTION_SET_NOT_FOUND = 'Optionset not found';

    static translationPropertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
    };

    static async _buildOptionIcon(cachedStyle: ?CachedStyle = {}) {
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

    static getRenderType(renderType: ?string) {
        return renderType && getCamelCaseUppercaseString(renderType);
    }

    cachedOptionSets: Map<string, CachedOptionSet>;
    locale: ?string;
    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
    ) {
        this.cachedOptionSets = cachedOptionSets;
        this.locale = locale;
    }

    _getTranslation(
        translations: Array<CachedOptionSetTranslation> | Array<CachedOptionTranslation>,
        property: $Values<typeof OptionSetFactory.translationPropertyNames>,
    ) {
        if (this.locale) {
            const translation = translations.find(t => t.property === property && t.locale === this.locale);
            return translation && translation.value;
        }
        return null;
    }

    async build(
        dataElement: DataElement,
        optionSetId: string,
        renderOptionsAsRadio: ?boolean,
        renderType: ?string,
        onGetDataElementType: (valueType: string) => string,
    ) {
        const cachedOptionSet = this.cachedOptionSets.get(optionSetId);
        if (!cachedOptionSet) {
            log.warn(
                errorCreator(OptionSetFactory.OPTION_SET_NOT_FOUND)({ id: optionSetId }),
            );
            return null;
        }

        dataElement.type = onGetDataElementType(cachedOptionSet.valueType);
        const optionsPromises = cachedOptionSet
            .options
            .map(async (cachedOption) => {
                const icon = await OptionSetFactory._buildOptionIcon(cachedOption.style);

                return new Option((_this) => {
                    _this.value = cachedOption.code;
                    _this.text =
                        this._getTranslation(
                            cachedOption.translations,
                            OptionSetFactory.translationPropertyNames.NAME) ||
                        cachedOption.displayName;
                    _this.icon = icon;
                });
            });

        const options = await Promise.all(optionsPromises);

        const optionSet = new OptionSet(cachedOptionSet.id, options, dataElement, convertOptionSetValue);
        optionSet.inputType = OptionSetFactory.getRenderType(renderType) ||
            (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
        return optionSet;
    }
}

export default OptionSetFactory;
