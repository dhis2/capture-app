/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string';
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

const getFeatureType = (featureType?: string | null) =>
    (featureType ? capitalizeFirstLetter(featureType.toLowerCase()) : 'None');

const isPluginElement = (attribute: ProgramTrackedEntityAttribute | PluginElement): attribute is PluginElement =>
    (attribute as PluginElement).type === FormFieldTypes.PLUGIN;

const isProgramTrackedEntityAttribute = (attribute: ProgramTrackedEntityAttribute | PluginElement): attribute is ProgramTrackedEntityAttribute =>
    !isPluginElement(attribute);

const buildProgramSection = programSection => programSection.trackedEntityAttributes.map(({ id }) => id);

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
    programTrackedEntityAttributes?: Array<ProgramTrackedEntityAttribute | PluginElement> | null;
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

const buildPluginAttributes = (pluginElement: PluginElement) =>
    pluginElement.fieldMap
        .filter(attributeField => attributeField.objectType === FieldElementObjectTypes.ATTRIBUTE)
        .reduce((acc, attribute) => {
            acc[attribute.IdFromApp] = attribute;
            return acc;
        }, {});

const createPluginConfig = (pluginElement: PluginElement, attributes: any) =>
    new FormFieldPluginConfig((o) => {
        o.id = pluginElement.id;
        o.name = pluginElement.name;
        o.pluginSource = pluginElement.pluginSource;
        o.fields = new Map();
        o.customAttributes = attributes;
    });

const processPluginElement = async (
    pluginElement: PluginElement,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
) => {
    const attributes = buildPluginAttributes(pluginElement);
    const element = createPluginConfig(pluginElement, attributes);

    /* eslint-disable no-await-in-loop */
    for (const field of pluginElement.fieldMap) {
        if (field.objectType && field.objectType === FieldElementObjectTypes.TRACKED_ENTITY_ATTRIBUTE) {
            const fieldElement = await buildDataElement(
                field as any,
                trackedEntityAttributes,
                optionSets,
                querySingleResource,
                minorServerVersion,
            );
            if (fieldElement) {
                element.addField(field.IdFromPlugin, fieldElement);
            }
        }
    }
    /* eslint-enable no-await-in-loop */

    return element;
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
    /* eslint-disable no-await-in-loop */
    for (const trackedEntityAttribute of programTrackedEntityAttributes) {
        if (isPluginElement(trackedEntityAttribute)) {
            const element = await processPluginElement(
                trackedEntityAttribute,
                trackedEntityAttributes,
                optionSets,
                querySingleResource,
                minorServerVersion,
            );
            element && section.addElement(element);
        } else if (isProgramTrackedEntityAttribute(trackedEntityAttribute)) {
            const element = await buildDataElement(
                trackedEntityAttribute,
                trackedEntityAttributes,
                optionSets,
                querySingleResource,
                minorServerVersion,
            );
            element && section.addElement(element);
        }
    }
    /* eslint-enable no-await-in-loop */
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

const buildAttributeDictionary = (programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute | PluginElement>) =>
    programTrackedEntityAttributes.reduce((acc, trackedEntityAttribute) => {
        if (isProgramTrackedEntityAttribute(trackedEntityAttribute) && trackedEntityAttribute.trackedEntityAttributeId) {
            acc[trackedEntityAttribute.trackedEntityAttributeId] = trackedEntityAttribute;
        }
        return acc;
    }, {});

const processFormConfigElement = (element: any, trackedEntityAttributeDictionary: any) => {
    if (element.type === FormFieldTypes.PLUGIN) {
        const fieldMap = element.fieldMap?.map(field => ({
            ...field,
            ...trackedEntityAttributeDictionary[field.IdFromApp],
        }));

        return {
            ...element,
            fieldMap,
        };
    }
    return trackedEntityAttributeDictionary[element.id];
};

const buildFormConfigAttributes = (formConfigSection: any, trackedEntityAttributeDictionary: any) =>
    formConfigSection.elements.reduce((acc, element) => {
        const processedElement = processFormConfigElement(element, trackedEntityAttributeDictionary);
        if (processedElement) {
            acc.push(processedElement);
        }
        return acc;
    }, []);

const processFormConfigSection = async (
    formConfigSection: any,
    trackedEntityAttributeDictionary: any,
    programSections: any,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
) => {
    const attributes = buildFormConfigAttributes(formConfigSection, trackedEntityAttributeDictionary);
    const sectionMetadata = programSections?.find(cachedSection => cachedSection.id === formConfigSection.id);

    if (!sectionMetadata && programSections && programSections.length > 0) {
        log.warn(
            errorCreator('Could not find metadata for section. This could indicate that your form configuration may be out of sync with your metadata.')(
                { sectionId: formConfigSection.id },
            ),
        );
    }

    return buildSection({
        programTrackedEntityAttributes: attributes,
        sectionCustomLabel: formConfigSection.name ?? sectionMetadata?.displayFormName ?? i18n.t('Profile'),
        sectionCustomId: formConfigSection.id,
        sectionDisplayDescription: sectionMetadata?.displayDescription ?? '',
        minorServerVersion,
        trackedEntityAttributes,
        optionSets,
        querySingleResource,
    });
};

const processProgramSections = async (
    programSections: any,
    trackedEntityAttributeDictionary: any,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
) => {
    const sections: Array<Section> = [];
    /* eslint-disable no-await-in-loop */
    for (const programSection of programSections) {
        const builtProgramSection = buildProgramSection(programSection);
        const section = await buildSection({
            programTrackedEntityAttributes: builtProgramSection.map(id => trackedEntityAttributeDictionary[id]),
            trackedEntityAttributes,
            optionSets,
            sectionCustomLabel: programSection.displayFormName,
            sectionCustomId: programSection.id,
            sectionDisplayDescription: programSection.displayDescription,
            querySingleResource,
            minorServerVersion,
        });
        if (section) {
            sections.push(section);
        }
    }
    /* eslint-enable no-await-in-loop */
    return sections;
};

const buildFormFoundationData = (program: any) => {
    const { programSections, trackedEntityType } = program;
    const programTrackedEntityAttributes = getProgramTrackedEntityAttributes(program.programTrackedEntityAttributes);
    const trackedEntityTypeId: string = getTrackedEntityTypeId(program);
    const trackedEntityAttributes = program.programTrackedEntityAttributes.reduce(
        (acc, currentValue) => [...acc, currentValue.trackedEntityAttribute],
        [],
    );
    const optionSets: Array<OptionSet> = trackedEntityAttributes.reduce(
        (acc, currentValue) => (currentValue.optionSet ? [...acc, currentValue.optionSet] : acc),
        [],
    );

    return {
        programSections,
        trackedEntityType,
        programTrackedEntityAttributes,
        trackedEntityTypeId,
        trackedEntityAttributes,
        optionSets,
    };
};

const buildFormFoundationWithSections = async (
    foundationData: any,
    renderFoundation: RenderFoundation,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
    dataEntryFormConfig?: DataEntryFormConfig | null,
) => {
    const { programSections, trackedEntityType, programTrackedEntityAttributes, trackedEntityTypeId, trackedEntityAttributes, optionSets } = foundationData;

    if (trackedEntityTypeId) {
        const section = await buildTetFeatureTypeSection(trackedEntityTypeId, trackedEntityType);
        section && renderFoundation.addSection(section);
    }

    if (programTrackedEntityAttributes) {
        const trackedEntityAttributeDictionary = buildAttributeDictionary(programTrackedEntityAttributes);

        if (dataEntryFormConfig) {
            await processDataEntryFormConfig(
                dataEntryFormConfig,
                trackedEntityAttributeDictionary,
                programSections,
                trackedEntityAttributes,
                optionSets,
                querySingleResource,
                minorServerVersion,
                renderFoundation,
            );
        } else {
            const sections = await processProgramSections(
                programSections,
                trackedEntityAttributeDictionary,
                trackedEntityAttributes,
                optionSets,
                querySingleResource,
                minorServerVersion,
            );
            sections.forEach(section => renderFoundation.addSection(section));
        }
    }
};

const processDataEntryFormConfig = async (
    dataEntryFormConfig: DataEntryFormConfig,
    trackedEntityAttributeDictionary: any,
    programSections: any,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
    renderFoundation: RenderFoundation,
) => {
    const sectionPromises = (dataEntryFormConfig as any).map((formConfigSection: any) =>
        processFormConfigSection(
            formConfigSection,
            trackedEntityAttributeDictionary,
            programSections,
            trackedEntityAttributes,
            optionSets,
            querySingleResource,
            minorServerVersion,
        ),
    );

    const sections = await Promise.all(sectionPromises);
    sections.forEach(section => section && renderFoundation.addSection(section));
};

const initializeRenderFoundation = (program: any) => new RenderFoundation((o) => {
    o.featureType = getFeatureType(program.featureType);
    o.name = program.displayName;
});

const buildFormFoundationSections = async (
    foundationData: any,
    renderFoundation: RenderFoundation,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
    dataEntryFormConfig?: DataEntryFormConfig | null,
) => {
    if (foundationData.programSections?.length || dataEntryFormConfig) {
        await buildFormFoundationWithSections(
            foundationData,
            renderFoundation,
            querySingleResource,
            minorServerVersion,
            dataEntryFormConfig,
        );
    } else {
        const section = await buildMainSection({
            trackedEntityType: foundationData.trackedEntityType,
            trackedEntityAttributes: foundationData.trackedEntityAttributes,
            optionSets: foundationData.optionSets,
            programTrackedEntityAttributes: foundationData.programTrackedEntityAttributes,
            querySingleResource,
            minorServerVersion,
        });
        section && renderFoundation.addSection(section);
    }
};

const buildFormFoundation = async (program: any, querySingleResource: QuerySingleResource, minorServerVersion: number, dataEntryFormConfig?: DataEntryFormConfig | null) => {
    const foundationData = buildFormFoundationData(program);
    const renderFoundation = initializeRenderFoundation(program);

    await buildFormFoundationSections(
        foundationData,
        renderFoundation,
        querySingleResource,
        minorServerVersion,
        dataEntryFormConfig,
    );

    return renderFoundation;
};

export const build = async (
    program: any,
    setFormFoundation: ((formFoundation: RenderFoundation) => void) | undefined,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
    dataEntryFormConfig?: DataEntryFormConfig | null,
) => {
    const formFoundation = (await buildFormFoundation(program, querySingleResource, minorServerVersion, dataEntryFormConfig)) || {};
    setFormFoundation && setFormFoundation(formFoundation);
};
