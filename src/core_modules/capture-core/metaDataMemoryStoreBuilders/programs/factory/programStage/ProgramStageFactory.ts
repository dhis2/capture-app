/* eslint-disable no-underscore-dangle */

import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { camelCaseUppercaseString } from 'capture-core-utils/string/getCamelCaseFromUppercase';
import type {
    CachedProgramStageDataElement,
    CachedProgramStageSection,
    CachedProgramStage,
    CachedProgramStageDataElementsAsObject,
    CachedOptionSet,
    CachedDataElement,
} from '../../../../storageControllers';
import { Section, ProgramStage, RenderFoundation, CustomForm } from '../../../../metaData';
import { buildIcon } from '../../../common/helpers';
import { isNonEmptyArray } from '../../../../utils/isNonEmptyArray';
import { DataElementFactory } from './DataElementFactory';
import { RelationshipTypesFactory } from './RelationshipTypesFactory';
import type { ConstructorInput, SectionSpecs } from './programStageFactory.types';
import { transformEventNode } from '../transformNodeFuntions/transformNodeFunctions';
import type { DataEntryFormConfig } from '../../../../components/DataEntries/common/TEIAndEnrollment';
import { FormFieldTypes } from '../../../../components/D2Form/FormFieldPlugin/FormFieldPlugin.const';
import { FormFieldPluginConfig } from '../../../../metaData/FormFieldPluginConfig';
import {
    FieldElementObjectTypes,
} from '../../../../components/DataEntries/common/TEIAndEnrollment/useMetadataForRegistrationForm';

export class ProgramStageFactory {
    static CUSTOM_FORM_TEMPLATE_ERROR = 'Error in custom form template';

    cachedOptionSets: Map<string, CachedOptionSet>;
    locale: string | null;
    dataElementFactory: DataElementFactory;
    cachedDataElements: Map<string, CachedDataElement> | null | undefined;
    relationshipTypesFactory: RelationshipTypesFactory;
    dataEntryFormConfig: DataEntryFormConfig | null | undefined;

    constructor({
        cachedOptionSets,
        cachedRelationshipTypes,
        cachedDataElements,
        locale,
        minorServerVersion,
        dataEntryFormConfig,
    }: ConstructorInput) {
        this.cachedOptionSets = cachedOptionSets;
        this.locale = locale;
        this.relationshipTypesFactory = new RelationshipTypesFactory(
            cachedRelationshipTypes,
        );
        this.cachedDataElements = cachedDataElements;
        this.dataElementFactory = new DataElementFactory(
            cachedOptionSets,
            locale,
            minorServerVersion,
        );
        this.dataEntryFormConfig = dataEntryFormConfig;
    }

    async _buildSection(
        cachedProgramStageDataElements: CachedProgramStageDataElementsAsObject,
        sectionSpecs: SectionSpecs) {
        const section = new Section((o) => {
            o.id = sectionSpecs.id;
            o.name = sectionSpecs.displayName;
            o.displayDescription = sectionSpecs.displayDescription;
        });

        if (sectionSpecs.dataElements) {
            await (sectionSpecs.dataElements as any).asyncForEach(async (sectionDataElement) => {
                if ((sectionDataElement as any).type === FormFieldTypes.PLUGIN) {
                    const attributes = (sectionDataElement as any).fieldMap
                        .filter(attributeField => attributeField.objectType === FieldElementObjectTypes.ATTRIBUTE)
                        .reduce((acc, attribute) => {
                            acc[attribute.IdFromApp] = attribute;
                            return acc;
                        }, {});

                    const element = new FormFieldPluginConfig((o) => {
                        o.id = sectionDataElement.id;
                        o.name = (sectionDataElement as any).name;
                        o.pluginSource = (sectionDataElement as any).pluginSource;
                        o.fields = new Map();
                        o.customAttributes = attributes;
                    });

                    await ((sectionDataElement as any).fieldMap as any).asyncForEach(async (field) => {
                        if (field.objectType && field.objectType === FieldElementObjectTypes.TRACKED_ENTITY_ATTRIBUTE) {
                            const id = field.dataElementId;
                            const cachedProgramStageDataElement = cachedProgramStageDataElements[id];
                            if (!cachedProgramStageDataElement) {
                                log.error(
                                    errorCreator('could not find programStageDataElement')(
                                        { sectionDataElement }));
                                return;
                            }
                            const currentField = await this.dataElementFactory
                                .build(cachedProgramStageDataElement, section);
                            currentField && element.addField(field.IdFromPlugin, currentField);
                        }
                    });

                    element && section.addElement(element);
                } else {
                    const id = sectionDataElement.id;
                    const cachedProgramStageDataElement = cachedProgramStageDataElements[id];

                    if (!cachedProgramStageDataElement) {
                        log.error(
                            errorCreator('could not find programStageDataElement')(
                                { sectionDataElement }));
                        return;
                    }

                    const cachedDataElementDefinition = this
                        .cachedDataElements
                        ?.get(cachedProgramStageDataElement.dataElementId);

                    const element = await this.dataElementFactory.build(
                        cachedProgramStageDataElement,
                        section,
                        cachedDataElementDefinition,
                    );
                    element && section.addElement(element);
                }
            });
        }

        return section;
    }

    async _addDataElementsToSection(section: Section, cachedProgramStageDataElements: Array<CachedProgramStageDataElement>) {
        await (cachedProgramStageDataElements as any).asyncForEach(async (cachedProgramStageDataElement) => {
            const cachedDataElementDefinition = this
                .cachedDataElements
                ?.get(cachedProgramStageDataElement.dataElementId);

            const element = await this.dataElementFactory.build(
                cachedProgramStageDataElement,
                section,
                cachedDataElementDefinition,
            );
            element && section.addElement(element);
        });
    }

    async _buildMainSection(cachedProgramStageDataElements: Array<CachedProgramStageDataElement> | null | undefined) {
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
        });

        if (cachedProgramStageDataElements) {
            await this._addDataElementsToSection(section, cachedProgramStageDataElements);
        }

        return section;
    }

    async _addLeftoversSection(stageForm: RenderFoundation, cachedProgramStageDataElements: Array<CachedProgramStageDataElement> | null | undefined) {
        if (!cachedProgramStageDataElements) return;

        // Check if there exist data elements which are not assigned to a section
        const dataElementsInSection = stageForm.getElements().reduce((acc, dataElement) => {
            acc.add(dataElement.id);
            return acc;
        }, new Set());

        const unassignedDataElements = cachedProgramStageDataElements
            .filter(dataElement => !dataElementsInSection.has(dataElement.dataElementId));

        if (unassignedDataElements.length === 0) return;

        // Create a special section for the unassigned data elements
        const section = new Section((o) => {
            o.id = Section.LEFTOVERS_SECTION_ID;
        });

        await this._addDataElementsToSection(section, unassignedDataElements);
        stageForm.addSection(section);
    }

    static _convertProgramStageDataElementsToObject(
        cachedProgramStageDataElements: Array<CachedProgramStageDataElement> | null | undefined): CachedProgramStageDataElementsAsObject {
        if (!cachedProgramStageDataElements) {
            return {};
        }

        return cachedProgramStageDataElements.reduce((accObject, d2ProgramStageDataElement) => {
            accObject[d2ProgramStageDataElement.dataElementId] = d2ProgramStageDataElement;
            return accObject;
        }, {});
    }

    static _getFeatureType(cachedProgramStage: CachedProgramStage) {
        return cachedProgramStage.featureType ?
            capitalizeFirstLetter(cachedProgramStage.featureType.toLowerCase())
            :
            'None';
    }

    async build(
        cachedProgramStage: CachedProgramStage,
        programId: string,
    ) {
        const stage = new ProgramStage((_stage) => {
            _stage.id = cachedProgramStage.id;
            _stage.name = cachedProgramStage.displayName;
            _stage.untranslatedName = cachedProgramStage.name;
            _stage.relationshipTypes = this.relationshipTypesFactory.build(
                programId,
                cachedProgramStage.id,
            );
            _stage.enableUserAssignment = !!cachedProgramStage.enableUserAssignment;
            _stage.autoGenerateEvent = !!cachedProgramStage.autoGenerateEvent;
            _stage.allowGenerateNextVisit = !!cachedProgramStage.allowGenerateNextVisit;
            _stage.askCompleteEnrollmentOnEventComplete = !!cachedProgramStage.remindCompleted;
            _stage.access = cachedProgramStage.access;
            _stage.hideDueDate = !!cachedProgramStage.hideDueDate;
            _stage.openAfterEnrollment = !!cachedProgramStage.openAfterEnrollment;
            _stage.generatedByEnrollmentDate = !!cachedProgramStage.generatedByEnrollmentDate;
            _stage.reportDateToUse = cachedProgramStage.reportDateToUse;
            _stage.minDaysFromStart = cachedProgramStage.minDaysFromStart;
            _stage.blockEntryForm = !!cachedProgramStage.blockEntryForm;
            _stage.repeatable = cachedProgramStage.repeatable;
            _stage.stageForm = new RenderFoundation((_form) => {
                _form.id = cachedProgramStage.id;
                _form.name = cachedProgramStage.displayName;
                _form.description = cachedProgramStage.description ?? null;
                _form.featureType = ProgramStageFactory._getFeatureType(cachedProgramStage);
                _form.access = cachedProgramStage.access;
                _form.addLabel({ id: 'occurredAt', label: cachedProgramStage.displayExecutionDateLabel || 'Report date' });
                _form.addLabel({ id: 'scheduledAt', label: cachedProgramStage.displayDueDateLabel || 'Scheduled date' });
                _form.validationStrategy =
                    cachedProgramStage.validationStrategy &&
                    camelCaseUppercaseString(cachedProgramStage.validationStrategy);
            });
            _stage.icon = buildIcon(cachedProgramStage.style);
        });

        const stageForm = stage.stageForm;

        if (cachedProgramStage.formType === 'CUSTOM' && cachedProgramStage.dataEntryForm) {
            const section = await this._buildMainSection(cachedProgramStage.programStageDataElements);
            section.showContainer = false;
            stageForm.addSection(section);
            const dataEntryForm = cachedProgramStage.dataEntryForm;
            try {
                section.customForm = new CustomForm((o) => {
                    o.id = dataEntryForm.id;
                });
                section.customForm.setData(dataEntryForm.htmlCode, transformEventNode as any);
            } catch (error) {
                log.error(errorCreator(ProgramStageFactory.CUSTOM_FORM_TEMPLATE_ERROR)(
                    { template: dataEntryForm.htmlCode, error }));
            }
        } else if (this.dataEntryFormConfig) {
            const dataElementDictionary = cachedProgramStage.programStageDataElements.reduce((acc, dataElement) => {
                acc[dataElement.dataElementId] = dataElement;
                return acc;
            }, {});

            await (this.dataEntryFormConfig as any).asyncForEach(async (formConfigSection) => {
                const formElements = formConfigSection.elements.reduce((acc, element) => {
                    if (element.type === FormFieldTypes.PLUGIN) {
                        const fieldMap = element
                            .fieldMap
                            ?.map(field => ({
                                ...field,
                                ...dataElementDictionary[field.IdFromApp],
                            }));

                        acc.push({
                            ...element,
                            fieldMap,
                        });
                        return acc;
                    }

                    const dataElement = dataElementDictionary[element.id];
                    if (dataElement) {
                        acc.push({
                            ...dataElement,
                            id: element.id,
                        });
                    }
                    return acc;
                }, []);

                if (isNonEmptyArray(formElements)) {
                    const cachedProgramStageDataElementsAsObject =
                        ProgramStageFactory._convertProgramStageDataElementsToObject(
                            cachedProgramStage.programStageDataElements,
                        );

                    const metadataSection = cachedProgramStage.programStageSections?.find(
                        section => section.id === formConfigSection.id,
                    );

                    const section = await this._buildSection(
                        cachedProgramStageDataElementsAsObject,
                        {
                            id: formConfigSection.id,
                            displayName: metadataSection?.displayName || formConfigSection.name,
                            displayDescription: metadataSection?.displayDescription || '',
                            dataElements: formElements,
                        },
                    );

                    section && stageForm.addSection(section);
                }
            });
        } else if (isNonEmptyArray(cachedProgramStage.programStageSections)) {
            const cachedProgramStageDataElementsAsObject =
                ProgramStageFactory._convertProgramStageDataElementsToObject(
                    cachedProgramStage.programStageDataElements,
                );

            await (cachedProgramStage.programStageSections as any).asyncForEach(async (section: CachedProgramStageSection) => {
                const builtSection = await this._buildSection(cachedProgramStageDataElementsAsObject, {
                    id: section.id,
                    displayName: section.displayName,
                    displayDescription: section.displayDescription,
                    dataElements: section.dataElements,
                });
                builtSection && stageForm.addSection(builtSection);
            });
        } else {
            stageForm.addSection(await this._buildMainSection(cachedProgramStage.programStageDataElements));
        }

        await this._addLeftoversSection(stageForm, cachedProgramStage.programStageDataElements);

        return stage;
    }
}
