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
import { DataElement, DateDataElement, Icon, dataElementTypes } from '../../../../metaData';
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

    // eslint-disable-next-line complexity
    async _setBaseProperties(
        dataElement: DataElement,
        cachedProgramStageDataElement: CachedProgramStageDataElement,
    ) {
        const cachedDataElement = cachedProgramStageDataElement.dataElement;
        dataElement.id = cachedDataElement.id;
        dataElement.name = this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.NAME) ||
            cachedDataElement.displayName;
        dataElement.shortName =
            this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.SHORT_NAME) ||
            cachedDataElement.displayShortName;
        dataElement.formName =
            this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.FORM_NAME) ||
            cachedDataElement.displayFormName;
        dataElement.description =
            this._getDataElementTranslation(cachedDataElement, DataElementFactory.propertyNames.DESCRIPTION) ||
            cachedDataElement.description;
        dataElement.displayInForms = true;
        dataElement.displayInReports = cachedProgramStageDataElement.displayInReports;
        dataElement.compulsory = cachedProgramStageDataElement.compulsory;
        dataElement.disabled = false;
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
    }

    async _buildBaseDataElement(
        cachedProgramStageDataElement: CachedProgramStageDataElement,
        dataElementType: $Values<typeof dataElementTypes>,
    ) {
        const dataElement = new DataElement();
        dataElement.type = dataElementType;
        await this._setBaseProperties(dataElement, cachedProgramStageDataElement);
        return dataElement;
    }

    async _buildDateDataElement(cachedProgramStageDataElement: CachedProgramStageDataElement) {
        const dateDataElement = new DateDataElement();
        dateDataElement.type = dataElementTypes.DATE;
        dateDataElement.allowFutureDate = cachedProgramStageDataElement.allowFutureDate;
        await this._setBaseProperties(dateDataElement, cachedProgramStageDataElement);
        return dateDataElement;
    }

    build(
        cachedProgramStageDataElement: CachedProgramStageDataElement,
    ): ?Promise<DataElement> {
        if (!cachedProgramStageDataElement.dataElement) {
            log.error(
                errorCreator('programStageDataElement does not contain a dataElement')(
                    { programStageDataElement: cachedProgramStageDataElement }));
            return null;
        }

        const dataElementType =
            DataElementFactory._getDataElementType(cachedProgramStageDataElement.dataElement.valueType);

        return dataElementType === dataElementTypes.DATE ?
            this._buildDateDataElement(cachedProgramStageDataElement) :
            this._buildBaseDataElement(cachedProgramStageDataElement, dataElementType);
    }
}

export default DataElementFactory;
