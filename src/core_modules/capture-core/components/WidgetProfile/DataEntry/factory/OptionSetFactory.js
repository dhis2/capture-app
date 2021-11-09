// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { camelCaseUppercaseString } from 'capture-core-utils/string/getCamelCaseFromUppercase';
import { errorCreator } from 'capture-core-utils';
import type { CachedOptionSet } from '../../../../storageControllers/cache.types';
import { OptionSet, Option, optionSetInputTypes as inputTypes } from '../../../../metaData';
import type { DataElement } from '../../../../metaData';
import { convertOptionSetValue } from '../../../../converters/serverToClient';
import { buildIcon } from '../../../../metaDataMemoryStoreBuilders/common/helpers';
import { OptionGroup } from '../../../../metaData/OptionSet/OptionGroup';

export class OptionSetFactory {
    static OPTION_SET_NOT_FOUND = 'Optionset not found';

    static getRenderType(renderType: ?string) {
        return renderType && camelCaseUppercaseString(renderType);
    }

    cachedOptionSets: Map<string, CachedOptionSet>;
    constructor(cachedOptionSets: Map<string, CachedOptionSet>) {
        this.cachedOptionSets = cachedOptionSets;
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
            log.warn(errorCreator(OptionSetFactory.OPTION_SET_NOT_FOUND)({ id: optionSetId }));
            return null;
        }

        dataElement.type = onGetDataElementType(cachedOptionSet.valueType);
        const optionsPromises = cachedOptionSet.options.map(async (cachedOption) => {
            const icon = buildIcon(cachedOption.style);
            return new Option((o) => {
                o.id = cachedOption.id;
                o.value = cachedOption.code;
                o.text = cachedOption.displayName;
                o.icon = icon;
            });
        });

        const options = await Promise.all(optionsPromises);

        const optionGroups =
            cachedOptionSet.optionGroups &&
            new Map(
                cachedOptionSet.optionGroups.map(group => [
                    group.id,
                    new OptionGroup((o) => {
                        o.id = group.id;
                        o.optionIds = new Map(group.options.map(option => [option, option]));
                    }),
                ]),
            );

        const optionSet = new OptionSet(cachedOptionSet.id, options, optionGroups, dataElement, convertOptionSetValue);
        optionSet.inputType =
            OptionSetFactory.getRenderType(renderType) ||
            (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
        return optionSet;
    }
}
