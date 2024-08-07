// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    RenderFoundation,
    Section,
    TeiRegistration,
    InputSearchGroup,
    DataElement,
} from '../../../../metaData';
import type { SearchGroup, TrackedEntityType } from '../../../../metaData';
import type {
    CachedTrackedEntityType,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';
import { DataElementFactory } from './DataElementFactory';
import type { ConstructorInput } from './teiRegistrationFactory.types';
import { FormFieldPluginConfig } from '../../../../metaData/FormFieldPluginConfig';
import type { DataEntryFormConfig } from '../../../../components/DataEntries/common/TEIAndEnrollment';
import { FormFieldTypes } from '../../../../components/D2Form/FormFieldPlugin/FormFieldPlugin.const';
import {
    FieldElementObjectTypes,
} from '../../../../components/DataEntries/common/TEIAndEnrollment/useMetadataForRegistrationForm';

export class TeiRegistrationFactory {
    static _buildSearchGroupElement(searchGroupElement: DataElement, teiAttribute: Object) {
        const element = new DataElement((o) => {
            o.id = searchGroupElement.id;
            o.name = searchGroupElement.name;
            o.shortName = searchGroupElement.shortName;
            o.formName = searchGroupElement.formName;
            o.description = searchGroupElement.description;
            o.displayInForms = true;
            o.displayInReports = searchGroupElement.displayInReports;
            o.compulsory = searchGroupElement.compulsory;
            o.disabled = searchGroupElement.disabled;
            o.type = teiAttribute.valueType;
            o.optionSet = searchGroupElement.optionSet;
        });
        return element;
    }

    static _buildTetFeatureTypeField(
        cachedType: CachedTrackedEntityType,
    ) {
        const featureType = cachedType.featureType;
        if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
            return null;
        }

        // $FlowFixMe
        return DataElementFactory.buildtetFeatureType(featureType);
    }

    dataElementFactory: DataElementFactory;
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    dataEntryFormConfig: ?DataEntryFormConfig;

    constructor({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        dataEntryFormConfig,
        locale,
        minorServerVersion,
    }: ConstructorInput) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.dataElementFactory = new DataElementFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
            minorServerVersion,
        });
        this.dataEntryFormConfig = dataEntryFormConfig;
    }

    async _buildSection(
        cachedType: CachedTrackedEntityType,
    ) {
        const featureTypeField = TeiRegistrationFactory._buildTetFeatureTypeField(cachedType);
        const cachedTrackedEntityTypeAttributes = cachedType.trackedEntityTypeAttributes;
        if ((!cachedTrackedEntityTypeAttributes ||
                cachedTrackedEntityTypeAttributes.length <= 0) &&
            !featureTypeField) {
            return null;
        }

        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.name = i18n.t('Profile');
        });
        featureTypeField && section.addElement(featureTypeField);

        if (this.dataEntryFormConfig && cachedTrackedEntityTypeAttributes) {
            const trackedEntityAttributeDictionary = cachedTrackedEntityTypeAttributes
                .reduce((acc, trackedEntityAttribute) => {
                    if (trackedEntityAttribute.trackedEntityAttributeId) {
                        acc[trackedEntityAttribute.trackedEntityAttributeId] = trackedEntityAttribute;
                    }
                    return acc;
                }, {});

            // $FlowFixMe
            this.dataEntryFormConfig.asyncForEach(async (formConfigSection) => {
                const fieldElements = formConfigSection.elements.reduce((acc, element) => {
                    if (element.type === FormFieldTypes.PLUGIN) {
                        const fieldMap = element
                            .fieldMap
                            ?.map(field => ({
                                ...field,
                                ...trackedEntityAttributeDictionary[field.IdFromApp],
                            }));

                        acc.push({ ...element, fieldMap });
                        return acc;
                    }
                    const cachedElement = trackedEntityAttributeDictionary[element.id];
                    if (cachedElement) {
                        acc.push(cachedElement);
                    }
                    return acc;
                }, []);

                await fieldElements.asyncForEach(async (trackedEntityAttribute) => {
                    if (trackedEntityAttribute?.type === FormFieldTypes.PLUGIN) {
                        const attributes = trackedEntityAttribute.fieldMap
                            .filter(attributeField => attributeField.objectType === 'Attribute')
                            .reduce((acc, attribute) => {
                                acc[attribute.IdFromApp] = attribute;
                                return acc;
                            }, {});
                        const element = new FormFieldPluginConfig((o) => {
                            o.id = trackedEntityAttribute.id;
                            o.name = trackedEntityAttribute.name;
                            o.pluginSource = trackedEntityAttribute.pluginSource;
                            o.fields = new Map();
                            o.customAttributes = attributes;
                        });


                        await trackedEntityAttribute.fieldMap.asyncForEach(async (field) => {
                            if (field.objectType === FieldElementObjectTypes.TRACKED_ENTITY_ATTRIBUTE) {
                                const dataElement = await this.dataElementFactory.build(field);
                                if (!dataElement) return;

                                element.addField(field.IdFromPlugin, dataElement);
                            }
                        });

                        element && section.addElement(element);
                    } else {
                        const element = await this.dataElementFactory.build(trackedEntityAttribute);
                        element && section.addElement(element);
                    }
                });
            });
            return section;
        }

        if (cachedTrackedEntityTypeAttributes && cachedTrackedEntityTypeAttributes.length > 0) {
            // $FlowFixMe
            await cachedTrackedEntityTypeAttributes.asyncForEach(async (trackedEntityAttribute) => {
                const element = await this.dataElementFactory.build(trackedEntityAttribute);
                element && section.addElement(element);
            });
        }

        return section;
    }

    async _buildFoundation(
        cachedType: CachedTrackedEntityType,
    ) {
        const foundation = new RenderFoundation((o) => {
            o.name = cachedType.displayName;
            o.id = cachedType.id;
        });

        const section = await this._buildSection(cachedType);
        section && foundation.addSection(section);

        return foundation;
    }

    _buildInputSearchGroupFoundation(
        cachedType: CachedTrackedEntityType,
        searchGroup: SearchGroup,
    ) {
        const typeTeiAttributes = cachedType.trackedEntityTypeAttributes || [];
        const teiAttributesAsObject = typeTeiAttributes.reduce((accTeiAttributes, typeTeiAttribute) => {
            if (!typeTeiAttribute.trackedEntityAttributeId) {
                log.error(
                    errorCreator('TrackedEntityAttributeId missing from trackedEntityTypeAttribute')(
                        { typeTeiAttribute }));
                return accTeiAttributes;
            }
            const teiAttribute = this.cachedTrackedEntityAttributes.get(typeTeiAttribute.trackedEntityAttributeId);
            if (!teiAttribute) {
                log.error(errorCreator('could not retrieve tei attribute')({ typeTeiAttribute }));
            } else {
                accTeiAttributes[teiAttribute.id] = teiAttribute;
            }
            return accTeiAttributes;
        }, {});

        const searchGroupFoundation = searchGroup.searchForm;

        const foundation = new RenderFoundation();
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
        });
        Array.from(
            searchGroupFoundation
                .getSection(Section.MAIN_SECTION_ID)
                // $FlowFixMe : there should be one
                .elements
                .entries())
            .map(entry => entry[1])
            .forEach((e) => {
                const element = TeiRegistrationFactory._buildSearchGroupElement(e, teiAttributesAsObject[e.id]);
                element && section.addElement(element);
            });
        foundation.addSection(section);
        return foundation;
    }

    _buildInputSearchGroups(
        cachedType: CachedTrackedEntityType,
        trackedEntityTypeSearchGroups: Array<SearchGroup>,
    ) {
        const inputSearchGroups: Array<InputSearchGroup> = trackedEntityTypeSearchGroups
            .filter(searchGroup => !searchGroup.unique)
            .map(searchGroup => new InputSearchGroup((o) => {
                o.id = searchGroup.id;
                o.minAttributesRequiredToSearch = searchGroup.minAttributesRequiredToSearch;
                o.searchFoundation = this._buildInputSearchGroupFoundation(cachedType, searchGroup);
            }));
        return inputSearchGroups;
    }

    async build(
        cachedType: CachedTrackedEntityType,
        trackedEntityTypeSearchGroups: Array<SearchGroup> = [],
        trackedEntityType: TrackedEntityType,
    ) {
        const foundation = await this._buildFoundation(cachedType);
        const inputSearchGroups = this._buildInputSearchGroups(cachedType, trackedEntityTypeSearchGroups);
        // const inputSearchGroups = await this._build
        return new TeiRegistration((o) => {
            o.form = foundation;
            o.inputSearchGroups = inputSearchGroups;
            o.trackedEntityType = trackedEntityType;
        });
    }
}
