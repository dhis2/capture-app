// @flow
import log from 'loglevel';
import type {
    CachedStyle,
    CachedDataElement,
    CachedProgramStageDataElement,
    CachedOptionSet,

} from './cache.types';
import getDhisIconAsync from './getDhisIcon';
import Icon from '../../metaData/Icon/Icon';
import DataElement from '../../metaData/DataElement/DataElement';
import OptionSet from '../../metaData/OptionSet/OptionSet';
import Option from '../../metaData/OptionSet/Option';
import errorCreator from '../../utils/errorCreator';
import getCamelCaseUppercaseString from './getCamelCaseUppercaseString';
import { inputTypes } from '../../metaData/OptionSet/optionSet.const';
import { convertOptionSetValue } from '../../converters/serverToClient';

const OPTION_SET_NOT_FOUND = 'Optionset not found';

const propertyNames = {
    NAME: 'NAME',
    DESCRIPTION: 'DESCRIPTION',
    SHORT_NAME: 'SHORT_NAME',
    FORM_NAME: 'FORM_NAME',
};

let currentLocale: ?string;

async function buildDataElementIconAsync(cachedStyle: CachedStyle = {}) {
    const icon = cachedStyle && cachedStyle.icon;
    if (!icon) {
        return null;
    }

    try {
        const iconData = await getDhisIconAsync(icon);
        return new Icon((_this) => {
            if (cachedStyle.color) {
                _this.color = cachedStyle.color;
            }
            _this.data = iconData;
        });
    } catch (error) {
        return null;
    }
}


function getDataElementTranslation(d2DataElement: CachedDataElement, property: $Values<typeof propertyNames>) {
    return currentLocale && d2DataElement.translations[currentLocale] && d2DataElement.translations[currentLocale][property];
}

function getDataElementType(d2ValueType: string) {
    const converters = {
    };

    return converters[d2ValueType] || d2ValueType;
}

async function buildOptionIcon(cachedStyle: CachedStyle = {}) {
    const icon = cachedStyle && cachedStyle.icon;
    if (!icon) {
        return null;
    }

    try {
        const iconData = await getDhisIconAsync(icon);
        return new Icon((_this) => {
            if (cachedStyle.color) {
                _this.color = cachedStyle.color;
            }
            _this.data = iconData;
        });
    } catch (error) {
        return null;
    }
}

function getRenderType(renderType: string) {
    return renderType && getCamelCaseUppercaseString(renderType);
}

async function buildOptionSet(
    d2OptionSet: CachedOptionSet,
    dataElement: DataElement,
    renderOptionsAsRadio: ?boolean,
    renderType: string) {
    dataElement.type = getDataElementType(d2OptionSet.valueType);

    const optionsPromises = d2OptionSet
        .options
        .map(async (d2Option) => {
            const icon = await buildOptionIcon(d2Option.style);

            return new Option((_this) => {
                _this.value = d2Option.code;
                _this.text = d2Option.displayName;
                _this.icon = icon;
            });
        });

    const options = await Promise.all(optionsPromises);

    const optionSet = new OptionSet(d2OptionSet.id, options, dataElement, convertOptionSetValue);
    optionSet.inputType = getRenderType(renderType) || (renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null);
    return optionSet;
}

export default async function buildDataElement(
    d2ProgramStageDataElement: CachedProgramStageDataElement,
    d2OptionSets: ?Array<CachedOptionSet>,
    locale?: ?string,
) {
    currentLocale = locale;
    const d2DataElement = d2ProgramStageDataElement.dataElement;

    const dataElement = new DataElement((_this) => {
        _this.id = d2DataElement.id;
        _this.name = getDataElementTranslation(d2DataElement, propertyNames.NAME) || d2DataElement.displayName;
        _this.shortName = getDataElementTranslation(d2DataElement, propertyNames.SHORT_NAME) || d2DataElement.displayShortName;
        _this.formName = getDataElementTranslation(d2DataElement, propertyNames.FORM_NAME) || d2DataElement.displayFormName;
        _this.description = getDataElementTranslation(d2DataElement, propertyNames.DESCRIPTION) || d2DataElement.description;
        _this.displayInForms = true;
        _this.displayInReports = d2ProgramStageDataElement.displayInReports;
        _this.compulsory = d2ProgramStageDataElement.compulsory;
        _this.disabled = false;
        _this.type = getDataElementType(d2DataElement.valueType);
    });

    dataElement.icon = await buildDataElementIconAsync(d2DataElement.style);

    if (d2DataElement.optionSet && d2DataElement.optionSet.id) {
        const d2OptionSet = d2OptionSets && d2OptionSets.find(d2Os => d2Os.id === d2DataElement.optionSet.id);
        if (!d2OptionSet) {
            log.warn(
                errorCreator(OPTION_SET_NOT_FOUND)({ id: d2DataElement.optionSet.id }),
            );
        } else {
            dataElement.optionSet = await buildOptionSet(
                d2OptionSet,
                dataElement,
                d2ProgramStageDataElement.renderOptionsAsRadio,
                d2ProgramStageDataElement.renderType && d2ProgramStageDataElement.renderType.DESKTOP && d2ProgramStageDataElement.renderType.DESKTOP.type);
        }
    }
    return dataElement;
}
