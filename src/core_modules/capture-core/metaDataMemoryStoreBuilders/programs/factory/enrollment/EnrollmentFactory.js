// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { errorCreator } from 'capture-core-utils';
import type {
    CachedDataEntryForm,
    CachedProgram,
    CachedProgramSection,
    CachedProgramTrackedEntityAttribute,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../storageControllers/cache.types';
import type { SearchGroup, TrackedEntityType } from '../../../../metaData';
import { CustomForm, Enrollment, InputSearchGroup, RenderFoundation, Section, DataElement } from '../../../../metaData';
import { DataElementFactory } from './DataElementFactory';
import type { ConstructorInput } from './enrollmentFactory.types';
import { transformTrackerNode } from '../transformNodeFuntions/transformNodeFunctions';
import { FormFieldPluginConfig } from '../../../../metaData/FormFieldPluginConfig';
import type { DataEntryFormConfig } from '../../../../components/DataEntries/common/TEIAndEnrollment';
import { FormFieldTypes } from '../../../../components/D2Form/FormFieldPlugin/FormFieldPlugin.const';
import {
    FieldElementObjectTypes,
} from '../../../../components/DataEntries/common/TEIAndEnrollment/useMetadataForRegistrationForm';

export class EnrollmentFactory {
    static errorMessages = {
        CUSTOM_FORM_TEMPLATE_ERROR: 'Error in custom form template',
    };

    static _addLabels(enrollment: Enrollment, cachedProgram: CachedProgram) {
        if (cachedProgram.displayEnrollmentDateLabel) {
            enrollment.enrollmentDateLabel =
                cachedProgram.displayEnrollmentDateLabel;
        }
        if (cachedProgram.displayIncidentDateLabel) {
            enrollment.incidentDateLabel = cachedProgram.displayIncidentDateLabel;
        }
    }

    static _addFlags(enrollment: Enrollment, cachedProgram: CachedProgram) {
        enrollment.allowFutureEnrollmentDate = cachedProgram.selectEnrollmentDatesInFuture;
        enrollment.allowFutureIncidentDate = cachedProgram.selectIncidentDatesInFuture;
        enrollment.showIncidentDate = cachedProgram.displayIncidentDate;
    }

    static _getFeatureType(cachedFeatureType: ?string) {
        return cachedFeatureType ?
            capitalizeFirstLetter(cachedFeatureType.toLowerCase())
            :
            'None';
    }

    locale: ?string;
    dataElementFactory: DataElementFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>;
    dataEntryFormConfig: ?DataEntryFormConfig;

    constructor({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        cachedTrackedEntityTypes,
        trackedEntityTypeCollection,
        locale,
        dataEntryFormConfig,
        minorServerVersion,
    }: ConstructorInput) {
        this.locale = locale;
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.cachedTrackedEntityTypes = cachedTrackedEntityTypes;
        this.dataEntryFormConfig = dataEntryFormConfig;
        this.dataElementFactory = new DataElementFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
            minorServerVersion,
        });
    }

    _buildTetFeatureTypeField(trackedEntityTypeId: ?string, section: Section) {
        const teType = trackedEntityTypeId && this.cachedTrackedEntityTypes.get(trackedEntityTypeId);
        if (!teType) {
            return null;
        }

        const featureType = teType.featureType;
        if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
            return null;
        }

        // $FlowFixMe
        return DataElementFactory.buildtetFeatureType(featureType, section);
    }

    async _buildTetFeatureTypeSection(
        cachedProgramTrackedEntityTypeId: string,
    ) {
        const trackedEntityType = this.cachedTrackedEntityTypes.get(cachedProgramTrackedEntityTypeId);

        const section = new Section((o) => {
            o.id = cachedProgramTrackedEntityTypeId;
            o.name = trackedEntityType?.displayName || '';
            o.group = Section.groups.ENROLLMENT;
        });
        const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId, section);

        if (!featureTypeField) {
            return null;
        }

        featureTypeField && section.addElement(featureTypeField);
        return section;
    }

    async _buildMainSection(
        cachedProgramTrackedEntityAttributes?: ?Array<CachedProgramTrackedEntityAttribute>,
        cachedProgramTrackedEntityTypeId?: ?string,
    ) {
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.name = i18n.t('Profile');
            o.group = Section.groups.ENROLLMENT;
        });

        if (!cachedProgramTrackedEntityAttributes?.length) { return null; }

        if (cachedProgramTrackedEntityTypeId) {
            const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId, section);
            featureTypeField && section.addElement(featureTypeField);
        }

        await this._buildElementsForSection(cachedProgramTrackedEntityAttributes, section);
        return section;
    }

    async _buildElementsForSection(
        cachedProgramTrackedEntityAttributes: ?Array<CachedProgramTrackedEntityAttribute>,
        section: Section,
    ) {
        // $FlowFixMe
        await cachedProgramTrackedEntityAttributes.asyncForEach(async (trackedEntityAttribute) => {
            if (trackedEntityAttribute?.type === FormFieldTypes.PLUGIN) {
                const attributes = trackedEntityAttribute.fieldMap
                    .filter(attributeField => attributeField.objectType === FieldElementObjectTypes.ATTRIBUTE)
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
                    if (field.objectType && field.objectType === FieldElementObjectTypes.TRACKED_ENTITY_ATTRIBUTE) {
                        const fieldElement = await this.dataElementFactory.build(field, section);
                        if (!fieldElement) return;

                        element.addField(field.IdFromPlugin, fieldElement);
                    }
                });

                element && section.addElement(element);
            } else {
                const element = await this.dataElementFactory.build(trackedEntityAttribute, section);
                element && section.addElement(element);
            }
        });
        return section;
    }

    async _buildSection(
        cachedProgramTrackedEntityAttributes?: Array<CachedProgramTrackedEntityAttribute>,
        cachedSectionCustomLabel: string,
        cachedSectionCustomId: string,
        description: string,
    ) {
        if (!cachedProgramTrackedEntityAttributes?.length) {
            return null;
        }

        const section = new Section((o) => {
            o.id = cachedSectionCustomId;
            o.name = cachedSectionCustomLabel;
            o.displayDescription = description;
            o.group = Section.groups.ENROLLMENT;
        });

        await this._buildElementsForSection(cachedProgramTrackedEntityAttributes, section);
        return section;
    }

    async _buildCustomEnrollmentForm(
        enrollmentForm: RenderFoundation,
        dataEntryForm: CachedDataEntryForm,
        cachedProgramTrackedEntityAttributes: ?Array<CachedProgramTrackedEntityAttribute>,
    ) {
        if (!cachedProgramTrackedEntityAttributes) { return null; }

        let section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.group = Section.groups.ENROLLMENT;
        });

        section.showContainer = false;

        section = await this._buildElementsForSection(cachedProgramTrackedEntityAttributes, section);
        section && enrollmentForm.addSection(section);
        try {
            section.customForm = new CustomForm((o) => {
                o.id = dataEntryForm.id;
            });
            section.customForm.setData(dataEntryForm.htmlCode, transformTrackerNode);
        } catch (error) {
            log.error(errorCreator(EnrollmentFactory.errorMessages.CUSTOM_FORM_TEMPLATE_ERROR)({
                template: dataEntryForm.htmlCode, error, method: 'buildEnrollment' }));
        }
        return enrollmentForm;
    }

    async _buildEnrollmentForm(
        cachedProgram: CachedProgram,
        cachedProgramSections: ?Array<CachedProgramSection>,
    ) {
        const cachedProgramTrackedEntityAttributes = cachedProgram?.programTrackedEntityAttributes;

        const enrollmentForm = new RenderFoundation((o) => {
            o.featureType = EnrollmentFactory._getFeatureType(cachedProgram.featureType);
            o.name = cachedProgram.displayName;
        });

        let section;
        if (cachedProgram.dataEntryForm) {
            if (cachedProgram.trackedEntityTypeId) {
                section = await this._buildTetFeatureTypeSection(cachedProgram.trackedEntityTypeId);
                section && enrollmentForm.addSection(section);
            }

            await this._buildCustomEnrollmentForm(
                enrollmentForm,
                cachedProgram.dataEntryForm,
                cachedProgramTrackedEntityAttributes,
            );
        } else if (cachedProgramSections?.length || this.dataEntryFormConfig) {
            if (cachedProgram.trackedEntityTypeId) {
                section = await this._buildTetFeatureTypeSection(cachedProgram.trackedEntityTypeId);
                section && enrollmentForm.addSection(section);
            }

            if (cachedProgramTrackedEntityAttributes) {
                const trackedEntityAttributeDictionary = cachedProgramTrackedEntityAttributes
                    .reduce((acc, trackedEntityAttribute) => {
                        if (trackedEntityAttribute.trackedEntityAttributeId) {
                            acc[trackedEntityAttribute.trackedEntityAttributeId] = trackedEntityAttribute;
                        }
                        return acc;
                    }, {});

                if (this.dataEntryFormConfig) {
                    // $FlowFixMe
                    this.dataEntryFormConfig.asyncForEach(async (formConfigSection) => {
                        const attributes = formConfigSection.elements.reduce((acc, element) => {
                            if (element.type === FormFieldTypes.PLUGIN) {
                                const fieldMap = element
                                    .fieldMap
                                    ?.map(field => ({
                                        ...field,
                                        ...trackedEntityAttributeDictionary[field.IdFromApp],
                                    }));

                                acc.push({
                                    ...element,
                                    fieldMap,
                                });
                                return acc;
                            }
                            const attribute = trackedEntityAttributeDictionary[element.id];
                            if (attribute) {
                                acc.push(attribute);
                            }
                            return acc;
                        }, []);

                        const sectionMetadata = cachedProgramSections
                            ?.find(cachedSection => cachedSection.id === formConfigSection.id);

                        if (!sectionMetadata && cachedProgramSections && cachedProgramSections.length > 0) {
                            log.warn(
                                errorCreator('Could not find metadata for section. This could indicate that your form configuration may be out of sync with your metadata.')(
                                    { sectionId: formConfigSection.id },
                                ),
                            );
                        }

                        section = await this._buildSection(
                            attributes,
                            formConfigSection.name ?? sectionMetadata?.displayFormName ?? i18n.t('Profile'),
                            formConfigSection.id,
                            sectionMetadata?.displayDescription ?? '',
                        );
                        section && enrollmentForm.addSection(section);
                    });
                } else if (cachedProgramSections) {
                    // $FlowFixMe
                    cachedProgramSections.asyncForEach(async (programSection) => {
                        section = await this._buildSection(
                            programSection.trackedEntityAttributes.map(id => trackedEntityAttributeDictionary[id]),
                            programSection.displayFormName,
                            programSection.id,
                            programSection.displayDescription,
                        );
                        section && enrollmentForm.addSection(section);
                    });
                }
            }
        } else {
            section = await this._buildMainSection(
                cachedProgramTrackedEntityAttributes,
                cachedProgram.trackedEntityTypeId,
            );
            section && enrollmentForm.addSection(section);
        }
        return enrollmentForm;
    }

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

    _buildInputSearchGroupFoundation(
        cachedProgram: CachedProgram,
        searchGroup: SearchGroup,
    ) {
        const programTeiAttributes = cachedProgram.programTrackedEntityAttributes || [];
        const teiAttributesAsObject = programTeiAttributes.reduce((accTeiAttributes, programTeiAttribute) => {
            if (!programTeiAttribute.trackedEntityAttributeId) {
                log.error(
                    errorCreator('TrackedEntityAttributeId missing from programTrackedEntityAttribute')(
                        { programTeiAttribute }));
                return accTeiAttributes;
            }
            const teiAttribute = this.cachedTrackedEntityAttributes.get(programTeiAttribute.trackedEntityAttributeId);
            if (!teiAttribute) {
                log.error(errorCreator('could not retrieve tei attribute')({ programTeiAttribute }));
            } else {
                accTeiAttributes[teiAttribute.id] = teiAttribute;
            }
            return accTeiAttributes;
        }, {});

        const searchGroupFoundation = searchGroup.searchForm;

        const foundation = new RenderFoundation();
        const section = new Section((oSection) => {
            oSection.id = Section.MAIN_SECTION_ID;
            oSection.group = Section.groups.ENROLLMENT;
        });
        Array.from(
            searchGroupFoundation
                .getSection(Section.MAIN_SECTION_ID)
                // $FlowFixMe : there should be one
                .elements
                .entries())
            .map(entry => entry[1])
            .forEach((e) => {
                const element = EnrollmentFactory._buildSearchGroupElement(e, teiAttributesAsObject[e.id]);
                element && section.addElement(element);
            });
        foundation.addSection(section);
        return foundation;
    }

    _buildInputSearchGroups(
        cachedProgram: CachedProgram,
        programSearchGroups: Array<SearchGroup> = [],
    ) {
        const inputSearchGroups: Array<InputSearchGroup> = programSearchGroups
            .filter(searchGroup => !searchGroup.unique)
            .map(searchGroup => new InputSearchGroup((o) => {
                o.id = searchGroup.id;
                o.minAttributesRequiredToSearch = searchGroup.minAttributesRequiredToSearch;
                o.searchFoundation = this._buildInputSearchGroupFoundation(cachedProgram, searchGroup);
            }));
        return inputSearchGroups;
    }

    async build(
        cachedProgram: CachedProgram,
        programSearchGroups: Array<SearchGroup> = [],
    ) {
        const enrollment = new Enrollment((o) => {
            EnrollmentFactory._addLabels(o, cachedProgram);
            EnrollmentFactory._addFlags(o, cachedProgram);
            if (cachedProgram.trackedEntityTypeId) {
                const trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
                if (trackedEntityType) {
                    o.trackedEntityType = trackedEntityType;
                }
            }
            o.inputSearchGroups = this._buildInputSearchGroups(cachedProgram, programSearchGroups);
        });

        enrollment.enrollmentForm = await this._buildEnrollmentForm(cachedProgram, cachedProgram.programSections);
        return enrollment;
    }
}
