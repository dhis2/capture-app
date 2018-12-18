// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import {
    RenderFoundation,
    Section,
    SearchGroup,
    DataElement,
    dataElementTypes,
} from '../../../../metaData';
import type {
    CachedProgram,
    CachedAttributeTranslation,
    CachedProgramTrackedEntityAttribute,
    CachedTrackedEntityAttribute,
} from '../../../cache.types';
import errorCreator from '../../../../utils/errorCreator';

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

    async _buildElement(cachedProgramTrackedEntityAttribute: CachedProgramTrackedEntityAttribute) {
        const cachedAttribute = cachedProgramTrackedEntityAttribute.trackedEntityAttribute.id &&
            this.cachedTrackedEntityAttributes.get(
                cachedProgramTrackedEntityAttribute.trackedEntityAttribute.id,
            );

        if (!cachedAttribute) {
            log.error(
                errorCreator(
                    SearchGroupFactory.errorMessages.TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)(
                    { cachedProgramTrackedEntityAttribute }));
            return null;
        }

        const element = new DataElement((_this) => {
            _this.id = cachedAttribute.id;
            _this.name = this._getAttributeTranslation(
                cachedAttribute.translations, translationPropertyNames.NAME) ||
                cachedAttribute.displayName;
            _this.shortName = this._getAttributeTranslation(
                cachedAttribute.translations, translationPropertyNames.SHORT_NAME) ||
                cachedAttribute.displayShortName;
            _this.formName = this._getAttributeTranslation(
                cachedAttribute.translations, translationPropertyNames.NAME) ||
                cachedAttribute.displayName;
            _this.description = this._getAttributeTranslation(
                cachedAttribute.translations, translationPropertyNames.DESCRIPTION) ||
                cachedAttribute.description;
            _this.displayInForms = true;
            _this.displayInReports = cachedProgramTrackedEntityAttribute.displayInList;
            _this.compulsory = !!cachedAttribute.unique;
            _this.disabled = false;
            _this.type = SearchGroupFactory._getSearchAttributeValueType(cachedAttribute.valueType, cachedAttribute.unique);
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

    async _buildSection(searchGroupAttributes: Array<CachedProgramTrackedEntityAttribute>) {
        const section = new Section((_this) => {
            _this.id = Section.MAIN_SECTION_ID;
        });

        // $FlowFixMe
        await searchGroupAttributes.asyncForEach(async (programAttribute) => {
            const element = await this._buildElement(programAttribute);
            element && section.addElement(element);
        });
        return section;
    }


    async _buildRenderFoundation(searchGroupAttributes: Array<CachedProgramTrackedEntityAttribute>) {
        const renderFoundation = new RenderFoundation();
        renderFoundation.addSection(await this._buildSection(searchGroupAttributes));
        return renderFoundation;
    }

    async _buildSearchGroup(
        key: string,
        searchGroupAttributes: Array<CachedProgramTrackedEntityAttribute>,
        program: CachedProgram,
    ) {
        const searchGroup = new SearchGroup();
        searchGroup.searchForm = await this._buildRenderFoundation(searchGroupAttributes);
        if (key === 'main') {
            searchGroup.minAttributesRequiredToSearch = program.minAttributesRequiredToSearch;
        } else {
            searchGroup.unique = true;
        }

        return searchGroup;
    }

    build(program: CachedProgram) {
        if (!program.programTrackedEntityAttributes) {
            return Promise.resolve([]);
        }

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
            .map(attrByGroupKey =>
                this._buildSearchGroup(attrByGroupKey, attributesBySearchGroup[attrByGroupKey], program));
        return Promise.all(searchGroupPromises);
    }
}

export default SearchGroupFactory;
