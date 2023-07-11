// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getUserStorageController } from '../../../../storageControllers';
import { userStores } from '../../../../storageControllers/stores';
import type {
    CachedDataElement,
    CachedProgramStageDataElement,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import { DataElement, DateDataElement, dataElementTypes } from '../../../../metaData';
import { buildIcon } from '../../../common/helpers';
import { OptionSetFactory } from '../../../common/factory';
import { isNotValidOptionSet } from '../../../../utils/isNotValidOptionSet';

export class DataElementFactory {
    static propertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
        FORM_NAME: 'FORM_NAME',
    };

    static errorMessages = {
        MULIT_TEXT_WITH_NO_OPTIONS_SET:
            'could not create the metadata because a MULIT_TEXT without associated option sets was found',
    };

    static _getDataElementType(cachedValueType: string) {
        const converters = {
        };

        return converters[cachedValueType] || cachedValueType;
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
        cachedDataElement: CachedDataElement,
    ) {
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
        dataElement.icon = buildIcon(cachedDataElement.style);
        dataElement.url = cachedDataElement.url;

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
        cachedDataElement: CachedDataElement,
        dataElementType: $Keys<typeof dataElementTypes>,
    ) {
        const dataElement = new DataElement();
        dataElement.type = dataElementType;
        await this._setBaseProperties(dataElement, cachedProgramStageDataElement, cachedDataElement);
        if (isNotValidOptionSet(dataElement.type, dataElement.optionSet)) {
            log.error(errorCreator(DataElementFactory.errorMessages.MULIT_TEXT_WITH_NO_OPTIONS_SET)({ dataElement }));
            return null;
        }
        return dataElement;
    }

    async _buildDateDataElement(
        cachedProgramStageDataElement: CachedProgramStageDataElement,
        cachedDataElement: CachedDataElement,
    ) {
        const dateDataElement = new DateDataElement();
        dateDataElement.type = dataElementTypes.DATE;
        dateDataElement.allowFutureDate = cachedProgramStageDataElement.allowFutureDate;
        await this._setBaseProperties(dateDataElement, cachedProgramStageDataElement, cachedDataElement);
        return dateDataElement;
    }

    async build(
        cachedProgramStageDataElement: CachedProgramStageDataElement,
    ): Promise<?DataElement> {
        const cachedDataElement =
            await getUserStorageController().get(userStores.DATA_ELEMENTS, cachedProgramStageDataElement.dataElementId);

        if (!cachedDataElement) {
            log.error(
                errorCreator('could not find underlying dataElement for programStageDataElement')(
                    { programStageDataElement: cachedProgramStageDataElement }));
            return null;
        }

        const dataElementType =
            DataElementFactory._getDataElementType(cachedDataElement.valueType);

        return dataElementType === dataElementTypes.DATE ?
            this._buildDateDataElement(cachedProgramStageDataElement, cachedDataElement) :
            this._buildBaseDataElement(cachedProgramStageDataElement, cachedDataElement, dataElementType);
    }
}
