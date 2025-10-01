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
import {
    UNSUPPORTED_SEARCH_ATTRIBUTE_TYPES,
    type FilteredAttribute,
} from '../../../../utils/warnings';
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
    static _getSearchAttributeValueType(valueType: string, isUnique?: boolean | null) {
        const searchAttributeValueType = searchAttributeElementTypes[valueType];
        return !isUnique && searchAttributeValueType ? searchAttributeValueType : valueType;
    }

    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    locale: string | null;
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
        property: typeof translationPropertyNames[keyof typeof translationPropertyNames],
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
              this._getAttributeTranslation(translations, translationPropertyNames.NAME)
              || displayName;

            o.shortName =
              this._getAttributeTranslation(translations, translationPropertyNames.SHORT_NAME)
              || displayShortName;

            o.formName =
              this._getAttributeTranslation(translations, translationPropertyNames.NAME)
              || displayFormName;

            o.description =
              this._getAttributeTranslation(translations, translationPropertyNames.DESCRIPTION)
              || description;

            o.displayInForms = true;
            o.displayInReports = searchAttribute.displayInList;
            o.disabled = false;
            o.type = SearchGroupFactory._getSearchAttributeValueType(valueType, unique);
        });

        const { optionSetValue, optionSet } = searchAttribute.trackedEntityAttribute;

        if (optionSetValue && optionSet.id) {
            element.optionSet = await this.optionSetFactory.build(
                element,
                optionSet.id,
                searchAttribute.renderOptionsAsRadio,
                null,
                value => value,
            );
        }

        return element;
    }

    async _buildSection(searchGroupAttributes) {
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.showContainer = false;
        });

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
        allAttributes: Array<SearchAttribute>,
    ) {
        // Filter out unsupported attributes for display purposes
        // Only include attributes that are searchable or unique (would have been shown)
        const filteredUnsupportedAttributes: FilteredAttribute[] = allAttributes
            .filter((attr) => {
                const valueType = attr.trackedEntityAttribute?.valueType;
                const isSearchableOrUnique = attr.searchable ||
                    attr.trackedEntityAttribute?.unique;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isUnsupported = valueType &&
                    UNSUPPORTED_SEARCH_ATTRIBUTE_TYPES.has(valueType as any);
                return isSearchableOrUnique && isUnsupported;
            })
            .map((attr) => {
                const tea = attr.trackedEntityAttribute;
                return {
                    id: tea?.id || '',
                    displayName: tea?.displayFormName || '',
                    valueType: tea?.valueType || '',
                };
            });

        const searchGroup = new SearchGroup();
        searchGroup.searchForm = await this._buildRenderFoundation(searchGroupAttributes);
        searchGroup.filteredUnsupportedAttributes = filteredUnsupportedAttributes;

        if (key === 'main') {
            searchGroup.minAttributesRequiredToSearch = minAttributesRequiredToSearch;
            searchGroup.id = 'main';
        } else {
            searchGroup.unique = true;
            searchGroup.id = 'unique';
        }

        return searchGroup;
    }

    getTrackedEntityAttribute(attribute: InputSearchAttribute): CachedTrackedEntityAttribute | null | undefined {
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

    build(
        searchAttributes: ReadonlyArray<InputSearchAttribute>,
        minAttributesRequiredToSearch: number,
    ): Promise<SearchGroup[]> {
        // Map all attributes with their tracked entity attribute data
        const allAttributesWithTEA = searchAttributes
            .map(attribute => ({
                ...attribute,
                trackedEntityAttribute: this.getTrackedEntityAttribute(attribute),
            }))
            .filter(attribute => attribute.trackedEntityAttribute)
            .map(attribute => ({
                ...attribute,
                trackedEntityAttribute: attribute.trackedEntityAttribute as CachedTrackedEntityAttribute,
            }));

        // Separate supported from unsupported attributes
        const supportedAttributes = allAttributesWithTEA
            .filter((attribute) => {
                const valueType = attribute.trackedEntityAttribute?.valueType;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isSupported = !valueType ||
                    !UNSUPPORTED_SEARCH_ATTRIBUTE_TYPES.has(valueType as any);
                const searchableOrUnique = attribute.searchable ||
                    attribute.trackedEntityAttribute.unique;
                return isSupported && searchableOrUnique;
            });

        // Group supported attributes by search group (unique vs main)
        const attributesBySearchGroup = supportedAttributes
            .reduce(
                (accGroups: Record<string, Array<SearchAttribute>>, attribute) => {
                    if (attribute.trackedEntityAttribute.unique) {
                        accGroups[attribute.trackedEntityAttribute.id] = [attribute];
                    } else {
                        accGroups.main = accGroups.main ?
                            [...accGroups.main, attribute] : [attribute];
                    }
                    return accGroups;
                }, {},
            );

        const searchGroupPromises = Object.keys(attributesBySearchGroup)
            .map(attrByGroupKey =>
                this._buildSearchGroup(
                    attrByGroupKey,
                    attributesBySearchGroup[attrByGroupKey],
                    minAttributesRequiredToSearch,
                    allAttributesWithTEA,
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
