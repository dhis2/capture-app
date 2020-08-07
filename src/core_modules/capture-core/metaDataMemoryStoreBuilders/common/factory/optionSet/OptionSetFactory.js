// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import getCamelCaseUppercaseString from 'capture-core-utils/string/getCamelCaseFromUppercase';
import { errorCreator } from 'capture-core-utils';
import type {
    CachedStyle,
    CachedOptionSet,
    CachedOptionGroup,
    CachedOptionSetTranslation,
    CachedOptionTranslation,
} from '../../../../storageControllers/cache.types';
import { OptionSet, Option, optionSetInputTypes as inputTypes, Icon } from '../../../../metaData';
import type { DataElement } from '../../../../metaData';
import { convertOptionSetValue } from '../../../../converters/serverToClient';
import getDhisIconAsync from '../../getDhisIcon';
import OptionGroup from '../../../../metaData/OptionSet/OptionGroup';

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
            return new Icon((o) => {
                // $FlowFixMe
                if (cachedStyle.color) {
                    o.color = cachedStyle.color;
                }
                o.data = iconData;
            });
        } catch (error) {
            return null;
        }
    }

    static getRenderType(renderType: ?string) {
        return renderType && getCamelCaseUppercaseString(renderType);
    }

    cachedOptionSets: Map<string, CachedOptionSet>;
    cachedOptionGroups: Array<CachedOptionGroup>;
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

                return new Option((o) => {
                    o.id = cachedOption.id;
                    o.value = cachedOption.code;
                    o.text =
                        this._getTranslation(
                            cachedOption.translations,
                            OptionSetFactory.translationPropertyNames.NAME) ||
                        cachedOption.displayName;
                    o.icon = icon;
                });
            });

        const options = await Promise.all(optionsPromises);

        const optionGroups = cachedOptionSet.optionGroups && new Map(cachedOptionSet.optionGroups.map(group => [group.id, new OptionGroup((o) => {
            o.id = group.id;
            o.optionIds = new Map(group.options.map(option => [option, option]));
        })]));

        const optionSet = new OptionSet(cachedOptionSet.id, options, optionGroups, dataElement, convertOptionSetValue);
        optionSet.inputType = OptionSetFactory.getRenderType(renderType) ||
            (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
        return optionSet;
    }
}

export default OptionSetFactory;
