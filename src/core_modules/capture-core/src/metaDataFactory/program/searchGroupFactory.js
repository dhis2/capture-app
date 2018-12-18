// @flow

import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import Section from '../../metaData/RenderFoundation/Section';
import SearchGroup from '../../metaData/SearchGroup/SearchGroup';
import DataElement from '../../metaData/DataElement/DataElement';
import elementTypes from '../../metaData/DataElement/elementTypes';
import type {
    CachedProgram,
    CachedAttributeTranslation,
    CachedProgramTrackedEntityAttribute,
} from './cache.types';

const searchAttributeElementTypes = {
    [elementTypes.NUMBER]: elementTypes.NUMBER_RANGE,
    [elementTypes.INTEGER]: elementTypes.INTEGER_RANGE,
    [elementTypes.INTEGER_POSITIVE]: elementTypes.INTEGER_POSITIVE_RANGE,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE,
    [elementTypes.INTEGER_NEGATIVE]: elementTypes.INTEGER_NEGATIVE_RANGE,
    [elementTypes.DATE]: elementTypes.DATE_RANGE,
};

const translationPropertyNames = {
    NAME: 'NAME',
    DESCRIPTION: 'DESCRIPTION',
    SHORT_NAME: 'SHORT_NAME',
};

let currentLocale: ?string;

function getAttributeTranslation(translations: Array<CachedAttributeTranslation>, property: $Values<typeof translationPropertyNames>) {
    if (currentLocale) {
        const translation = translations.find(t => t.property === property && t.locale === currentLocale);
        return translation && translation.value;
    }
    return null;
}

function getSearchAttributeValueType(valueType: string, isUnique: ?boolean) {
    const searchAttributeValueType = searchAttributeElementTypes[valueType];
    return !isUnique && searchAttributeValueType ? searchAttributeValueType : valueType;
}

async function buildElement(programAttribute: CachedProgramTrackedEntityAttribute) {
    const attribute = programAttribute.trackedEntityAttribute;

    const element = new DataElement((_this) => {
        _this.id = attribute.id;
        _this.name = getAttributeTranslation(attribute.translations, translationPropertyNames.NAME) || attribute.displayName;
        _this.shortName = getAttributeTranslation(attribute.translations, translationPropertyNames.SHORT_NAME) || attribute.displayShortName;
        _this.formName = getAttributeTranslation(attribute.translations, translationPropertyNames.NAME) || attribute.displayName;
        _this.description = getAttributeTranslation(attribute.translations, translationPropertyNames.DESCRIPTION) || attribute.description;
        _this.displayInForms = true;
        _this.displayInReports = programAttribute.displayInList;
        _this.compulsory = !!attribute.unique;
        _this.disabled = false;
        _this.type = getSearchAttributeValueType(attribute.valueType, attribute.unique);
    });

    /* if (attribute.optionSet && attribute.optionSet.id ) {
        element.optionSet = await buildOptionSet(
            attribute.optionSet.id,
            element,
            programAttribute.renderOptionsAsRadio,
            programAttribute.renderType && programAttribute.renderType.DESKTOP && programAttribute.renderType.DESKTOP.type);
    } */

    await Promise.resolve();

    return element;
}

async function buildSection(searchGroupAttributes: Array<CachedProgramTrackedEntityAttribute>) {
    const section = new Section((_this) => {
        _this.id = Section.MAIN_SECTION_ID;
    });

    // $FlowFixMe
    await searchGroupAttributes.asyncForEach(async (programAttribute) => {
        section.addElement(await buildElement(programAttribute));
    });
    return section;
}


async function buildRenderFoundation(searchGroupAttributes: Array<CachedProgramTrackedEntityAttribute>) {
    const renderFoundation = new RenderFoundation();
    renderFoundation.addSection(await buildSection(searchGroupAttributes));
    return renderFoundation;
}

async function buildSearchGroup(key: string, searchGroupAttributes: Array<CachedProgramTrackedEntityAttribute>, program: CachedProgram) {
    const searchGroup = new SearchGroup();
    searchGroup.searchForm = await buildRenderFoundation(searchGroupAttributes);
    if (key === 'main') {
        searchGroup.minAttributesRequiredToSearch = program.minAttributesRequiredToSearch;
    } else {
        searchGroup.unique = true;
    }

    return searchGroup;
}

export default function buildSearchGroups(program: CachedProgram, locale: ?string) {
    currentLocale = locale;

    const attributesBySearchGroup = program.programTrackedEntityAttributes
        .filter(attribute => attribute.searchable || attribute.trackedEntityAttribute.unique)
        .reduce((accGroups, attribute) => {
            if (attribute.trackedEntityAttribute.unique) {
                accGroups[attribute.trackedEntityAttribute.id] = [attribute];
            } else {
                accGroups.main = accGroups.main ? [...accGroups.main, attribute] : [attribute];
            }
            return accGroups;
        }, {});

    const searchGroupPromises = Object.keys(attributesBySearchGroup)
        .map(attrByGroupKey => buildSearchGroup(attrByGroupKey, attributesBySearchGroup[attrByGroupKey], program));
    return Promise.all(searchGroupPromises);
}
