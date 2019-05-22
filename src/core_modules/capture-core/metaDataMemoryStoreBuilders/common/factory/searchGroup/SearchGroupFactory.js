// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    RenderFoundation,
    Section,
    SearchGroup,
    DataElement,
    dataElementTypes,
} from '../../../../metaData';
import type {
    CachedAttributeTranslation,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';

type InputSearchAttribute = {
    trackedEntityAttributeId: ?string,
    searchable: boolean,
    displayInList: boolean,
}

type SearchAttribute = InputSearchAttribute & {
    trackedEntityAttribute: CachedTrackedEntityAttribute
}

const translationPropertyNames = {
    NAME: 'NAME',
    DESCRIPTION: 'DESCRIPTION',
    SHORT_NAME: 'SHORT_NAME',
};

const searchAttributeElementTypes = {
    [dataElementTypes.NUMBER]: dataElementTypes.NUMBER_RANGE,
    [dataElementTypes.INTEGER]: dataElementTypes.INTEGER_RANGE,
    [dataElementTypes.INTEGER_POSITIVE]: dataElementTypes.INTEGER_POSITIVE_RANGE,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE,
    [dataElementTypes.INTEGER_NEGATIVE]: dataElementTypes.INTEGER_NEGATIVE_RANGE,
    [dataElementTypes.DATE]: dataElementTypes.DATE_RANGE,
    [dataElementTypes.DATETIME]: dataElementTypes.DATETIME_RANGE,
    [dataElementTypes.TIME]: dataElementTypes.TIME_RANGE,
};


class SearchGroupFactory {
    static errorMessages = {
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'Tracked entity attribute not found',
    };
    static _getSearchAttributeValueType(valueType: string, isUnique: ?boolean) {
        const searchAttributeValueType = searchAttributeElementTypes[valueType];
        return !isUnique && searchAttributeValueType ? searchAttributeValueType : valueType;
    }

    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    locale: ?string;
    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        locale: ?string,
    ) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.locale = locale;
    }

    _getAttributeTranslation(
        translations: Array<CachedAttributeTranslation>,
        property: $Values<typeof translationPropertyNames>,
    ) {
        if (this.locale) {
            const translation = translations.find(t => t.property === property && t.locale === this.locale);
            return translation && translation.value;
        }
        return null;
    }

    async _buildElement(searchAttribute: SearchAttribute) {
        const trackedEntityAttribute = searchAttribute.trackedEntityAttribute;
        const element = new DataElement((_this) => {
            _this.id = trackedEntityAttribute.id;
            _this.name = this._getAttributeTranslation(
                trackedEntityAttribute.translations, translationPropertyNames.NAME) ||
                trackedEntityAttribute.displayName;
            _this.shortName = this._getAttributeTranslation(
                trackedEntityAttribute.translations, translationPropertyNames.SHORT_NAME) ||
                trackedEntityAttribute.displayShortName;
            _this.formName = this._getAttributeTranslation(
                trackedEntityAttribute.translations, translationPropertyNames.NAME) ||
                trackedEntityAttribute.displayName;
            _this.description = this._getAttributeTranslation(
                trackedEntityAttribute.translations, translationPropertyNames.DESCRIPTION) ||
                trackedEntityAttribute.description;
            _this.displayInForms = true;
            _this.displayInReports = searchAttribute.displayInList;
            _this.compulsory = !!trackedEntityAttribute.unique;
            _this.disabled = false;
            _this.type = SearchGroupFactory._getSearchAttributeValueType(trackedEntityAttribute.valueType, trackedEntityAttribute.unique);
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

    async _buildSection(searchGroupAttributes: Array<SearchAttribute>) {
        const section = new Section((_this) => {
            _this.id = Section.MAIN_SECTION_ID;
            _this.showContainer = false;
        });

        // $FlowFixMe
        await searchGroupAttributes.asyncForEach(async (programAttribute) => {
            const element = await this._buildElement(programAttribute);
            element && section.addElement(element);
        });
        return section;
    }


    async _buildRenderFoundation(searchGroupAttributes: Array<SearchAttribute>) {
        const renderFoundation = new RenderFoundation();
        renderFoundation.addSection(await this._buildSection(searchGroupAttributes));
        return renderFoundation;
    }

    async _buildSearchGroup(
        key: string,
        searchGroupAttributes: Array<SearchAttribute>,
        minAttributesRequiredToSearch: number,
    ) {
        const searchGroup = new SearchGroup();
        searchGroup.searchForm = await this._buildRenderFoundation(searchGroupAttributes);
        if (key === 'main') {
            searchGroup.minAttributesRequiredToSearch = minAttributesRequiredToSearch;
            searchGroup.id = 'main';
        } else {
            searchGroup.unique = true;
            searchGroup.id = 'unique';
        }

        return searchGroup;
    }

    getTrackedEntityAttribute(attribute: InputSearchAttribute): ?CachedTrackedEntityAttribute {
        const id = attribute.trackedEntityAttributeId;
        const trackedEntityAttribute = id ? this.cachedTrackedEntityAttributes.get(id) : null;
        if (!trackedEntityAttribute) {
            log.error(
                errorCreator(
                    'Tried to create a searchAttribute where trackedEntityAttributeId was not specified or the trackedEntityAttribute could not be retrieved from the cache')(
                    { attribute }),
            );
        }
        return trackedEntityAttribute;
    }

    build(searchAttributes: $ReadOnlyArray<InputSearchAttribute>, minAttributesRequiredToSearch: number) {
        const attributesBySearchGroup = searchAttributes
            .map(attribute => ({
                ...attribute,
                trackedEntityAttribute: this.getTrackedEntityAttribute(attribute),
            }))
            .filter(attribute =>
                attribute.trackedEntityAttribute && (attribute.searchable || attribute.trackedEntityAttribute.unique))
            .reduce((accGroups, attribute) => {
                // $FlowFixMe
                if (attribute.trackedEntityAttribute.unique) {
                    // $FlowFixMe
                    accGroups[attribute.trackedEntityAttribute.id] = [attribute];
                } else {
                    accGroups.main = accGroups.main ? [...accGroups.main, attribute] : [attribute];
                }
                return accGroups;
            }, {});

        const searchGroupPromises = Object.keys(attributesBySearchGroup)
            .map(attrByGroupKey =>
                this._buildSearchGroup(
                    attrByGroupKey,
                    attributesBySearchGroup[attrByGroupKey],
                    minAttributesRequiredToSearch,
                ));
        return Promise.all(searchGroupPromises);
    }
}

export default SearchGroupFactory;
