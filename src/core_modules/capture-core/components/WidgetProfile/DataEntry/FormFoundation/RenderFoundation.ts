import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import type {
    ProgramTrackedEntityAttribute,
    TrackedEntityAttribute,
    TrackedEntityType,
    OptionSet,
    PluginElement,
} from './types';
import { RenderFoundation, Section } from '../../../../metaData';
import { buildDataElement, buildTetFeatureType } from './DataElement';
import { getProgramTrackedEntityAttributes, getTrackedEntityTypeId } from '../helpers';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import { FieldElementObjectTypes, type DataEntryFormConfig } from '../../../DataEntries/common/TEIAndEnrollment';
import { FormFieldTypes } from '../../../D2Form/FormFieldPlugin/FormFieldPlugin.const';
import { FormFieldPluginConfig } from '../../../../metaData/FormFieldPluginConfig';

const getFeatureType = (featureType?: string) =>
    (featureType ? capitalizeFirstLetter(featureType.toLowerCase()) : 'None');

const isPluginElement = (attribute: ProgramTrackedEntityAttribute | PluginElement): attribute is PluginElement =>
    (attribute as PluginElement).type === FormFieldTypes.PLUGIN;

const isProgramTrackedEntityAttribute = (attribute: ProgramTrackedEntityAttribute | PluginElement): attribute is ProgramTrackedEntityAttribute =>
    !isPluginElement(attribute);

const buildProgramSection = (programSection: any) => programSection.trackedEntityAttributes.map(({ id }: any) => id);

const buildTetFeatureTypeField = (trackedEntityType: TrackedEntityType) => {
    if (!trackedEntityType) {
        return null;
    }

    const featureType = trackedEntityType.featureType;
    if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
        return null;
    }

    return buildTetFeatureType(featureType as 'POINT' | 'POLYGON');
};

const buildTetFeatureTypeSection = async (
    programTrackedEntityTypeId: string,
    trackedEntityType: TrackedEntityType,
) => {
    const featureTypeField = buildTetFeatureTypeField(trackedEntityType);

    if (!featureTypeField) {
        return null;
    }

    const section = new Section((o) => {
        o.id = programTrackedEntityTypeId;
        o.name = trackedEntityType?.displayName || '';
    });

    featureTypeField && section.addElement(featureTypeField);
    return section;
};

const buildMainSection = async ({
    trackedEntityType,
    trackedEntityAttributes,
    optionSets,
    programTrackedEntityAttributes,
    querySingleResource,
    minorServerVersion,
}: {
    trackedEntityType: TrackedEntityType;
    trackedEntityAttributes: Array<TrackedEntityAttribute>;
    optionSets: Array<OptionSet>;
    programTrackedEntityAttributes?: Array<ProgramTrackedEntityAttribute | PluginElement>;
    querySingleResource: QuerySingleResource;
    minorServerVersion: number;
}) => {
    const section = new Section((o) => {
        o.id = Section.MAIN_SECTION_ID;
        o.name = i18n.t('Profile');
    });

    if (!programTrackedEntityAttributes?.length) {
        return null;
    }

    const featureTypeField = buildTetFeatureTypeField(trackedEntityType);
    featureTypeField && section.addElement(featureTypeField);

    await buildElementsForSection({
        programTrackedEntityAttributes,
        trackedEntityAttributes,
        optionSets,
        section,
        querySingleResource,
        minorServerVersion,
    });
    return section;
};

const buildElementsForSection = async ({
    programTrackedEntityAttributes,
    trackedEntityAttributes,
    optionSets,
    section,
    querySingleResource,
    minorServerVersion,
}: {
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute | PluginElement>;
    trackedEntityAttributes: Array<TrackedEntityAttribute>;
    optionSets: Array<OptionSet>;
    section: Section;
    querySingleResource: QuerySingleResource;
    minorServerVersion: number;
}) => {
    const processedElements: any[] = [];
    for (const trackedEntityAttribute of programTrackedEntityAttributes) {
        if (isPluginElement(trackedEntityAttribute)) {
            const pluginElement = trackedEntityAttribute;

            const attributes = pluginElement.fieldMap
                .filter(attributeField => attributeField.objectType === FieldElementObjectTypes.ATTRIBUTE)
                .reduce((acc: any, attribute) => {
                    acc[attribute.IdFromApp] = attribute;
                    return acc;
                }, {});

            const element = new FormFieldPluginConfig((o) => {
                o.id = pluginElement.id;
                o.name = pluginElement.name;
                o.pluginSource = pluginElement.pluginSource;
                o.fields = new Map();
                o.customAttributes = attributes;
            });

            const fieldPromises = pluginElement.fieldMap
                .filter(field => field.objectType && field.objectType === FieldElementObjectTypes.TRACKED_ENTITY_ATTRIBUTE)
                .map(async (field) => {
                    const fieldElement = await buildDataElement(
                        field as any,
                        trackedEntityAttributes,
                        optionSets,
                        querySingleResource,
                        minorServerVersion,
                    );
                    return fieldElement ? { field, fieldElement } : null;
                });

            const resolvedFieldElements = await Promise.all(fieldPromises);
            const fieldElements = resolvedFieldElements.filter(Boolean) as Array<{ field: any; fieldElement: any }>;

            fieldElements.forEach(({ field, fieldElement }) => {
                element.addField(field.IdFromPlugin, fieldElement);
            });

            if (element) {
                processedElements.push(element);
            }
        } else if (isProgramTrackedEntityAttribute(trackedEntityAttribute)) {
            const programTrackedEntityAttribute = trackedEntityAttribute;
            processedElements.push({
                type: 'programAttribute',
                attribute: programTrackedEntityAttribute,
            });
        }
    }

    const programAttributeElements = processedElements.filter(el => el.type === 'programAttribute');
    const otherElements = processedElements.filter(el => el.type !== 'programAttribute');

    const programElementPromises = programAttributeElements.map(async (processedElement) => {
        const element = await buildDataElement(
            processedElement.attribute,
            trackedEntityAttributes,
            optionSets,
            querySingleResource,
            minorServerVersion,
        );
        return element;
    });

    const builtProgramElements = (await Promise.all(programElementPromises)).filter(Boolean);

    otherElements.forEach(element => section.addElement(element));
    builtProgramElements.forEach(element => section.addElement(element));
    return section;
};

const buildSection = async ({
    programTrackedEntityAttributes,
    trackedEntityAttributes,
    optionSets,
    sectionCustomLabel,
    sectionCustomId,
    sectionDisplayDescription,
    querySingleResource,
    minorServerVersion,
}: {
    programTrackedEntityAttributes?: Array<ProgramTrackedEntityAttribute | PluginElement>;
    trackedEntityAttributes: Array<TrackedEntityAttribute>;
    optionSets: Array<OptionSet>;
    sectionCustomLabel: string;
    sectionCustomId: string;
    sectionDisplayDescription: string;
    querySingleResource: QuerySingleResource;
    minorServerVersion: number;
}) => {
    if (!programTrackedEntityAttributes?.length) {
        return null;
    }

    const section = new Section((o) => {
        o.id = sectionCustomId;
        o.name = sectionCustomLabel;
        o.displayDescription = sectionDisplayDescription;
    });

    await buildElementsForSection({
        programTrackedEntityAttributes,
        trackedEntityAttributes,
        optionSets,
        section,
        querySingleResource,
        minorServerVersion,
    });
    return section;
};

export const buildFormFoundation = async (program: any, querySingleResource: QuerySingleResource, minorServerVersion: number, dataEntryFormConfig?: DataEntryFormConfig) => {
    const { programSections, trackedEntityType } = program;
    const programTrackedEntityAttributes = getProgramTrackedEntityAttributes(program.programTrackedEntityAttributes);
    const trackedEntityTypeId: string = getTrackedEntityTypeId(program);
    const trackedEntityAttributes = program.programTrackedEntityAttributes.reduce(
        (acc: any, currentValue: any) => [...acc, currentValue.trackedEntityAttribute],
        [],
    );
    const optionSets: Array<OptionSet> = trackedEntityAttributes.reduce(
        (acc: any, currentValue: any) => (currentValue.optionSet ? [...acc, currentValue.optionSet] : acc),
        [],
    );
    const renderFoundation = new RenderFoundation((o) => {
        o.featureType = getFeatureType(program.featureType);
        o.name = program.displayName;
    });

    let section;
    if (programSections?.length || dataEntryFormConfig) {
        if (trackedEntityTypeId) {
            section = await buildTetFeatureTypeSection(trackedEntityTypeId, trackedEntityType);
            section && renderFoundation.addSection(section);
        }
        if (programTrackedEntityAttributes) {
            const trackedEntityAttributeDictionary = programTrackedEntityAttributes
                .reduce((acc: any, trackedEntityAttribute: any) => {
                    if (trackedEntityAttribute.trackedEntityAttributeId) {
                        acc[trackedEntityAttribute.trackedEntityAttributeId] = trackedEntityAttribute;
                    }
                    return acc;
                }, {});


            if (dataEntryFormConfig) {
                const sectionsToProcess: Array<{ attributes: any; formConfigSection: any; sectionMetadata: any }> = [];
                for (const formConfigSection of dataEntryFormConfig as any) {
                    const attributes = formConfigSection.elements.reduce((acc: any, element: any) => {
                        if (element.type === FormFieldTypes.PLUGIN) {
                            const fieldMap = element
                                .fieldMap
                                ?.map((field: any) => ({
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

                    const sectionMetadata = programSections
                        ?.find((cachedSection: any) => cachedSection.id === formConfigSection.id);

                    if (!sectionMetadata && programSections && programSections.length > 0) {
                        log.warn(
                            errorCreator('Could not find metadata for section. This could indicate that your form configuration may be out of sync with your metadata.')(
                                { sectionId: formConfigSection.id },
                            ),
                        );
                    }

                    sectionsToProcess.push({
                        attributes,
                        formConfigSection,
                        sectionMetadata,
                    });
                }

                const sectionPromises = sectionsToProcess.map(async ({ attributes, formConfigSection, sectionMetadata }) =>
                    buildSection({
                        programTrackedEntityAttributes: attributes,
                        sectionCustomLabel: formConfigSection.name ?? sectionMetadata?.displayFormName ?? i18n.t('Profile'),
                        sectionCustomId: formConfigSection.id,
                        sectionDisplayDescription: sectionMetadata?.displayDescription ?? '',
                        minorServerVersion,
                        trackedEntityAttributes,
                        optionSets,
                        querySingleResource,
                    }),
                );

                const sections = await Promise.all(sectionPromises);
                sections.forEach((builtSection) => {
                    if (builtSection) {
                        renderFoundation.addSection(builtSection);
                    }
                });
            } else {
                const programSectionsToProcess: Array<{ programSection: any; builtProgramSection: any }> = [];
                for (const programSection of programSections) {
                    const builtProgramSection = buildProgramSection(programSection);
                    programSectionsToProcess.push({
                        programSection,
                        builtProgramSection,
                    });
                }

                const programSectionPromises = programSectionsToProcess.map(async ({ programSection, builtProgramSection }) =>
                    buildSection({
                        programTrackedEntityAttributes: builtProgramSection.map((id: any) => trackedEntityAttributeDictionary[id]),
                        trackedEntityAttributes,
                        optionSets,
                        sectionCustomLabel: programSection.displayFormName,
                        sectionCustomId: programSection.id,
                        sectionDisplayDescription: programSection.displayDescription,
                        querySingleResource,
                        minorServerVersion,
                    }),
                );

                const builtProgramSections = await Promise.all(programSectionPromises);
                builtProgramSections.forEach((builtSection) => {
                    if (builtSection) {
                        renderFoundation.addSection(builtSection);
                    }
                });
            }
        }
    } else {
        section = await buildMainSection({
            trackedEntityType,
            trackedEntityAttributes,
            optionSets,
            programTrackedEntityAttributes,
            querySingleResource,
            minorServerVersion,
        });
        section && renderFoundation.addSection(section);
    }
    return renderFoundation;
};

export const build = async (
    program: any,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
    dataEntryFormConfig?: DataEntryFormConfig,
    setFormFoundation?: (formFoundation: RenderFoundation) => void,
) => {
    const formFoundation = (await buildFormFoundation(program, querySingleResource, minorServerVersion, dataEntryFormConfig)) || {};
    setFormFoundation && setFormFoundation(formFoundation);
};
