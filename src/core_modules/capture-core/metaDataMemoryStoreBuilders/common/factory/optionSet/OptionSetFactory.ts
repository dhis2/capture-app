/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { camelCaseUppercaseString } from 'capture-core-utils/string/getCamelCaseFromUppercase';
import { errorCreator } from 'capture-core-utils';
import type {
    CachedOptionSet,
    CachedOptionSetTranslation,
    CachedOptionTranslation,
} from '../../../../storageControllers';
import { OptionSet, Option, optionSetInputTypes as inputTypes } from '../../../../metaData';
import type { DataElement } from '../../../../metaData';
import { convertOptionSetValue } from '../../../../converters/serverToClient';
import { buildIcon } from '../../../common/helpers';
import { OptionGroup } from '../../../../metaData/OptionSet/OptionGroup';
import type { OptionSetFactoryTranslationPropertyNames } from './OptionSetFactory.types';

export class OptionSetFactory {
    static OPTION_SET_NOT_FOUND = 'Optionset not found';

    static translationPropertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
    };

    static getRenderType(renderType?: string) {
        return renderType && camelCaseUppercaseString(renderType);
    }

    cachedOptionSets: Map<string, CachedOptionSet>;
    locale?: string;
    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale?: string,
    ) {
        this.cachedOptionSets = cachedOptionSets;
        this.locale = locale;
    }

    _getTranslation(
        translations: CachedOptionSetTranslation[] | CachedOptionTranslation[],
        property: keyof OptionSetFactoryTranslationPropertyNames,
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
        renderOptionsAsRadio?: boolean,
        renderType?: string,
        onGetDataElementType?: (valueType: string) => string,
    ) {
        const cachedOptionSet = this.cachedOptionSets.get(optionSetId);
        if (!cachedOptionSet) {
            log.warn(
                errorCreator(OptionSetFactory.OPTION_SET_NOT_FOUND)({ id: optionSetId }),
            );
            return null;
        }

        dataElement.type = onGetDataElementType ? onGetDataElementType(dataElement.type || cachedOptionSet.valueType) : (dataElement.type || cachedOptionSet.valueType);
        const optionsPromises = cachedOptionSet
            .options
            .map(async (cachedOption) => {
                const icon = buildIcon(cachedOption.style || undefined);
                return new Option((o) => {
                    o.id = cachedOption.id;
                    o.value = cachedOption.code;
                    o.code = cachedOption.code;
                    o.attributeValues = cachedOption.attributeValues;
                    o.text =
                        this._getTranslation(
                            cachedOption.translations,
                            'NAME') ||
                        cachedOption.displayName;
                    o.icon = icon;
                });
            });

        const options = await Promise.all(optionsPromises);

        const optionGroups = cachedOptionSet.optionGroups && new Map(cachedOptionSet.optionGroups.map(group => [group.id, new OptionGroup(function(this: any) {
            this.id = group.id;
            this.optionIds = new Map(group.options.map(option => [option, option]));
        })]));

        const optionSet = new OptionSet(
            cachedOptionSet.id,
            options,
            optionGroups,
            dataElement,
            convertOptionSetValue,
            cachedOptionSet.attributeValues,
        );
        optionSet.inputType = OptionSetFactory.getRenderType(renderType) ||
            (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
        return optionSet;
    }
}
