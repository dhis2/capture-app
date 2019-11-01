// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type {
    CachedStyle,
    CachedDataElement,
    CachedProgramStageDataElement,
    CachedOptionSet,

} from '../../../../storageControllers/cache.types';
import getDhisIconAsync from '../../../common/getDhisIcon';
import { DataElement, Icon } from '../../../../metaData';
import { OptionSetFactory } from '../../../common/factory';

class DataElementFactory {
    static propertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
        FORM_NAME: 'FORM_NAME',
    };

    static _getDataElementType(cachedValueType: string) {
        const converters = {
        };

        return converters[cachedValueType] || cachedValueType;
    }

    static async _buildDataElementIconAsync(cachedStyle: CachedStyle = {}) {
        const icon = cachedStyle && cachedStyle.icon;
        if (!icon) {
            return null;
        }

        try {
            const iconData = await getDhisIconAsync(icon);
            return new Icon((o) => {
                if (cachedStyle.color) {
                    o.color = cachedStyle.color;
                }
                o.data = iconData;
            });
        } catch (error) {
            return null;
        }
    }

    locale: ?string;
    optionSetFactory: OptionSetFactory;

    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
    ) {
        this.locale = locale;
        this.optionSetFactory = new OptionSetFactory(
            cachedOptionSets,
            locale,
        );
    }

    _getDataElementTranslation(
        cachedDataElement: CachedDataElement,
        property: $Values<typeof DataElementFactory.propertyNames>): ?string {
        return this.locale &&
            cachedDataElement.translations[this.locale] &&
            cachedDataElement.translations[this.locale][property];
    }

    async build(
        cachedProgramStageDataElement: CachedProgramStageDataElement,
    ) {
        if (!cachedProgramStageDataElement.dataElement) {
            log.error(
                errorCreator('programStageDataElement does not contain a dataElement')(
                    { programStageDataElement: cachedProgramStageDataElement }));
            return null;
        }

        const cachedDataElement = cachedProgramStageDataElement.dataElement;

        const dataElement = new DataElement((o) => {
            o.id = cachedDataElement.id;
            o.name = this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.NAME) ||
                cachedDataElement.displayName;
            o.shortName = this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.SHORT_NAME) ||
                cachedDataElement.displayShortName;
            o.formName = this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.FORM_NAME) ||
                cachedDataElement.displayFormName;
            o.description = this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.DESCRIPTION) ||
                cachedDataElement.description;
            o.displayInForms = true;
            o.displayInReports = cachedProgramStageDataElement.displayInReports;
            o.compulsory = cachedProgramStageDataElement.compulsory;
            o.disabled = false;
            o.type = DataElementFactory._getDataElementType(cachedDataElement.valueType);
        });

        dataElement.icon = await DataElementFactory._buildDataElementIconAsync(cachedDataElement.style);

        if (cachedDataElement.optionSet && cachedDataElement.optionSet.id) {
            dataElement.optionSet = await this.optionSetFactory.build(
                dataElement,
                cachedDataElement.optionSet.id,
                cachedProgramStageDataElement.renderOptionsAsRadio,
                cachedProgramStageDataElement.renderType &&
                cachedProgramStageDataElement.renderType.DESKTOP &&
                cachedProgramStageDataElement.renderType.DESKTOP.type,
                DataElementFactory._getDataElementType,
            );
        }
        return dataElement;
    }
}

export default DataElementFactory;
