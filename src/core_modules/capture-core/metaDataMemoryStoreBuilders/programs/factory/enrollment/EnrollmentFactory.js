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
import { DataEntryPlugin } from '../../../../metaData/DataEntryPlugin';
import type { DataEntryFormConfig } from '../../../../components/DataEntries/common/types';

export class EnrollmentFactory {
    static errorMessages = {
        CUSTOM_FORM_TEMPLATE_ERROR: 'Error in custom form template',
    };

    static _addLabels(enrollment: Enrollment, cachedProgram: CachedProgram) {
        if (cachedProgram.enrollmentDateLabel) {
            enrollment.enrollmentDateLabel = cachedProgram.enrollmentDateLabel;
        }
        if (cachedProgram.incidentDateLabel) {
            enrollment.incidentDateLabel = cachedProgram.incidentDateLabel;
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
        });
    }

    _buildTetFeatureTypeField(trackedEntityTypeId: ?string) {
        const teType = trackedEntityTypeId && this.cachedTrackedEntityTypes.get(trackedEntityTypeId);
        if (!teType) {
            return null;
        }

        const featureType = teType.featureType;
        if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
            return null;
        }

        // $FlowFixMe
        return DataElementFactory.buildtetFeatureType(featureType);
    }

    async _buildTetFeatureTypeSection(
        cachedProgramTrackedEntityTypeId: string,
    ) {
        const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId);
        const trackedEntityType = this.cachedTrackedEntityTypes.get(cachedProgramTrackedEntityTypeId);

        if (!featureTypeField) {
            return null;
        }

        const section = new Section((o) => {
            o.id = cachedProgramTrackedEntityTypeId;
            o.name = trackedEntityType?.displayName || '';
        });

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
        });

        if (!cachedProgramTrackedEntityAttributes?.length) { return null; }

        if (cachedProgramTrackedEntityTypeId) {
            const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId);
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
            if (trackedEntityAttribute?.id === 'plugin') {
                const element = new DataEntryPlugin((o) => {
                    o.id = trackedEntityAttribute.id;
                    o.name = trackedEntityAttribute.name;
                    o.fields = new Map();
                });

                await trackedEntityAttribute.fieldMap.asyncForEach(async (field) => {
                    const dataElement = await this.dataElementFactory.build(field);
                    dataElement && element.addField(field.IdFromPlugin, dataElement);
                });

                element && section.addElement(element);
            } else {
                const element = await this.dataElementFactory.build(trackedEntityAttribute);
                element && section.addElement(element);
            }
        });
        return section;
    }

    async _buildSection(
        cachedProgramTrackedEntityAttributes?: Array<CachedProgramTrackedEntityAttribute>,
        cachedSectionCustomLabel: string,
        cachedSectionCustomId: string,
    ) {
        if (!cachedProgramTrackedEntityAttributes?.length) {
            return null;
        }

        const section = new Section((o) => {
            o.id = cachedSectionCustomId;
            o.name = cachedSectionCustomLabel;
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
                            if (element.type === 'plugin') {
                                const fieldMap = element
                                    .fieldMap
                                    ?.map(field => ({
                                        ...field,
                                        ...trackedEntityAttributeDictionary[field.IdFromApp],
                                    }));

                                acc.push({ ...element, fieldMap });
                                return acc;
                            }
                            const attribute = trackedEntityAttributeDictionary[element.id];
                            if (attribute) {
                                acc.push(attribute);
                            }
                            return acc;
                        }, []);

                        section = await this._buildSection(
                            attributes,
                            formConfigSection.name,
                            formConfigSection.id,
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
