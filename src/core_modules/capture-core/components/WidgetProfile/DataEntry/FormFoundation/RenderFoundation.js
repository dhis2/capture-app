// @flow
/* eslint-disable no-underscore-dangle */
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

const getFeatureType = (featureType: ?string) =>
    (featureType ? capitalizeFirstLetter(featureType.toLowerCase()) : 'None');

const isPluginElement =
    (attribute: ProgramTrackedEntityAttribute | PluginElement): boolean %checks => attribute
        .type === FormFieldTypes.PLUGIN;

const isProgramTrackedEntityAttribute =
    (attribute: ProgramTrackedEntityAttribute | PluginElement): boolean %checks => !isPluginElement(attribute);

const buildProgramSection = programSection => programSection.trackedEntityAttributes.map(({ id }) => id);

const buildTetFeatureTypeField = (trackedEntityType: TrackedEntityType) => {
    if (!trackedEntityType) {
        return null;
    }

    const featureType = trackedEntityType.featureType;
    if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
        return null;
    }

    // $FlowFixMe
    return buildTetFeatureType(featureType);
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
    trackedEntityType: TrackedEntityType,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    programTrackedEntityAttributes?: ?Array<ProgramTrackedEntityAttribute | PluginElement>,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
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
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute | PluginElement>,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    section: Section,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
}) => {
    for (const trackedEntityAttribute of programTrackedEntityAttributes) {
        if (isPluginElement(trackedEntityAttribute)) {
            const pluginElement = ((trackedEntityAttribute: any): PluginElement);

            const attributes = pluginElement.fieldMap
                .filter(attributeField => attributeField.objectType === FieldElementObjectTypes.ATTRIBUTE)
                .reduce((acc, attribute) => {
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

            /* eslint-disable no-await-in-loop */
            // $FlowFixMe
            await pluginElement.fieldMap.asyncForEach(async (field) => {
                if (field.objectType && field.objectType === FieldElementObjectTypes.TRACKED_ENTITY_ATTRIBUTE) {
                    const fieldElement = await buildDataElement(
                        field,
                        trackedEntityAttributes,
                        optionSets,
                        querySingleResource,
                        minorServerVersion,
                    );
                    if (!fieldElement) return;

                    element.addField(field.IdFromPlugin, fieldElement);
                }
            });
            /* eslint-enable no-await-in-loop */

            element && section.addElement(element);
        } else if (isProgramTrackedEntityAttribute(trackedEntityAttribute)) {
            const programTrackedEntityAttribute = ((trackedEntityAttribute: any): ProgramTrackedEntityAttribute);
            // eslint-disable-next-line no-await-in-loop
            const element = await buildDataElement(
                programTrackedEntityAttribute,
                trackedEntityAttributes,
                optionSets,
                querySingleResource,
                minorServerVersion,
            );
            element && section.addElement(element);
        }
    }
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
    programTrackedEntityAttributes?: Array<ProgramTrackedEntityAttribute | PluginElement>,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    sectionCustomLabel: string,
    sectionCustomId: string,
    sectionDisplayDescription: string,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
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

export const buildFormFoundation = async (program: any, querySingleResource: QuerySingleResource, minorServerVersion: number, dataEntryFormConfig: ?DataEntryFormConfig) => {
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
                .reduce((acc, trackedEntityAttribute) => {
                    if (trackedEntityAttribute.trackedEntityAttributeId) {
                        acc[trackedEntityAttribute.trackedEntityAttributeId] = trackedEntityAttribute;
                    }
                    return acc;
                }, {});


            if (dataEntryFormConfig) {
                // $FlowFixMe
                await dataEntryFormConfig.asyncForEach(async (formConfigSection) => {
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

                    const sectionMetadata = programSections
                        ?.find(cachedSection => cachedSection.id === formConfigSection.id);

                    if (!sectionMetadata && programSections && programSections.length > 0) {
                        log.warn(
                            errorCreator('Could not find metadata for section. This could indicate that your form configuration may be out of sync with your metadata.')(
                                { sectionId: formConfigSection.id },
                            ),
                        );
                    }

                    section = await buildSection({
                        programTrackedEntityAttributes: attributes,
                        sectionCustomLabel: formConfigSection.name ?? sectionMetadata?.displayFormName ?? i18n.t('Profile'),
                        sectionCustomId: formConfigSection.id,
                        sectionDisplayDescription: sectionMetadata?.displayDescription ?? '',
                        minorServerVersion,
                        trackedEntityAttributes,
                        optionSets,
                        querySingleResource,
                    });
                    section && renderFoundation.addSection(section);
                });
            } else {
                for (const programSection of programSections) {
                    const builtProgramSection = buildProgramSection(programSection);

                    // eslint-disable-next-line no-await-in-loop
                    section = await buildSection({
                        programTrackedEntityAttributes: builtProgramSection.map(id => trackedEntityAttributeDictionary[id]),
                        trackedEntityAttributes,
                        optionSets,
                        sectionCustomLabel: programSection.displayFormName,
                        sectionCustomId: programSection.id,
                        sectionDisplayDescription: programSection.displayDescription,
                        querySingleResource,
                        minorServerVersion,
                    });
                    section && renderFoundation.addSection(section);
                }
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
    setFormFoundation?: (formFoundation: RenderFoundation) => void,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
    dataEntryFormConfig: ?DataEntryFormConfig,
) => {
    const formFoundation = (await buildFormFoundation(program, querySingleResource, minorServerVersion, dataEntryFormConfig)) || {};
    setFormFoundation && setFormFoundation(formFoundation);
};
