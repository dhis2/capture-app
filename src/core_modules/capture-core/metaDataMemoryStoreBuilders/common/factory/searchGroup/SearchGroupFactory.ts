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
} from '../../../../storageControllers';
import { OptionSetFactory } from '../optionSet';
import type { ConstructorInput, InputSearchAttribute, SearchAttribute } from './searchGroupFactory.types';

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
    [dataElementTypes.MULTI_TEXT]: dataElementTypes.TEXT,
};


export class SearchGroupFactory {
    static errorMessages = {
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'Tracked entity attribute not found',
    };
    static _getSearchAttributeValueType(valueType: string, isUnique?: boolean) {
        const searchAttributeValueType = searchAttributeElementTypes[valueType];
        return !isUnique && searchAttributeValueType ? searchAttributeValueType : valueType;
    }

    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    locale?: string;
    optionSetFactory: OptionSetFactory;
    constructor({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
    }: ConstructorInput) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.locale = locale;
        this.optionSetFactory = new OptionSetFactory(
            cachedOptionSets,
            locale,
        );
    }

    _getAttributeTranslation(
        translations: CachedAttributeTranslation[],
        property: keyof typeof translationPropertyNames,
    ) {
        if (this.locale) {
            const translation = translations.find(t => t.property === property && t.locale === this.locale);
            return translation && translation.value;
        }
        return null;
    }

    async _buildElement(searchAttribute: SearchAttribute) {
        const element = new DataElement((o) => {
            const {
                id,
                translations,
                displayName,
                displayFormName,
                displayShortName,
                description,
                unique,
                valueType,
            } = searchAttribute.trackedEntityAttribute;

            o.id = id;
            o.name =
              this._getAttributeTranslation(translations, 'NAME')
              || displayName;

            o.shortName =
               this._getAttributeTranslation(translations, 'SHORT_NAME')
              || displayShortName;

            o.formName =
              this._getAttributeTranslation(translations, 'NAME')
              || displayFormName;

            o.description =
               this._getAttributeTranslation(translations, 'DESCRIPTION')
              || description;

            o.displayInForms = true;
            o.displayInReports = searchAttribute.displayInList;
            o.disabled = false;
            o.type = SearchGroupFactory._getSearchAttributeValueType(valueType, unique || undefined);
        });

        const { optionSetValue, optionSet } = searchAttribute.trackedEntityAttribute;

        if (optionSetValue && optionSet.id) {
            element.optionSet = await this.optionSetFactory.build(
                element,
                optionSet.id,
                searchAttribute.renderOptionsAsRadio || undefined,
                undefined,
                value => value,
            ) || undefined;
        }

        return element;
    }

    async _buildSection(searchGroupAttributes: Array<SearchAttribute>) {
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.showContainer = false;
        });

        const elements = await Promise.all(
            searchGroupAttributes.map(programAttribute => this._buildElement(programAttribute)),
        );
        elements.forEach(element => element && section.addElement(element));
        return section;
    }


    async _buildRenderFoundation(searchGroupAttributes: Array<SearchAttribute>) {
        const renderFoundation = new RenderFoundation(null);
        renderFoundation.addSection(await this._buildSection(searchGroupAttributes));
        return renderFoundation;
    }

    async _buildSearchGroup(
        key: string,
        searchGroupAttributes: Array<SearchAttribute>,
        minAttributesRequiredToSearch: number,
    ) {
        const searchGroup = new SearchGroup(null);
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

    getTrackedEntityAttribute(attribute: InputSearchAttribute): CachedTrackedEntityAttribute | null {
        const id = attribute.trackedEntityAttributeId;
        const trackedEntityAttribute = id ? this.cachedTrackedEntityAttributes.get(id) : null;
        if (!trackedEntityAttribute) {
            log.error(
                errorCreator(
                    'Tried to create a searchAttribute where trackedEntityAttributeId was not specified or the trackedEntityAttribute could not be retrieved from the cache')(
                    { attribute }),
            );
        }
        return trackedEntityAttribute || null;
    }

    build(searchAttributes: ReadonlyArray<InputSearchAttribute>, minAttributesRequiredToSearch: number): Promise<SearchGroup[]> {
        const attributesBySearchGroup = searchAttributes
            .map(attribute => ({
                ...attribute,
                trackedEntityAttribute: this.getTrackedEntityAttribute(attribute),
            }))
            .filter(attribute =>
                attribute.trackedEntityAttribute && (attribute.searchable || attribute.trackedEntityAttribute.unique))
            .reduce((accGroups: any, attribute) => {
                if (attribute.trackedEntityAttribute!.unique) {
                    accGroups[attribute.trackedEntityAttribute!.id] = [attribute];
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
        return Promise.all(searchGroupPromises).then(
            searchGroups => searchGroups.sort(({ unique: xBoolean }, { unique: yBoolean }) => {
                if (xBoolean === yBoolean) {
                    return 0;
                }
                if (xBoolean) {
                    return -1;
                }
                return 1;
            },
            ),
        );
    }
}
