// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import type {
    ProgramTrackedEntityAttribute,
    TrackedEntityAttribute,
    TrackedEntityType,
    OptionSet,
} from './types';
import { RenderFoundation, Section } from '../../../../metaData';
import { buildDataElement, buildTetFeatureType } from './DataElement';
import { getProgramTrackedEntityAttributes, getTrackedEntityTypeId } from '../helpers';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const getFeatureType = (featureType: ?string) =>
    (featureType ? capitalizeFirstLetter(featureType.toLowerCase()) : 'None');

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
    programTrackedEntityAttributes?: ?Array<ProgramTrackedEntityAttribute>,
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
    programTrackedEntityAttributes: Array<ProgramTrackedEntityAttribute>,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    section: Section,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
}) => {
    for (const trackedEntityAttribute of programTrackedEntityAttributes) {
        // eslint-disable-next-line no-await-in-loop
        const element = await buildDataElement(
            trackedEntityAttribute,
            trackedEntityAttributes,
            optionSets,
            querySingleResource,
            minorServerVersion,
        );
        element && section.addElement(element);
    }
    return section;
};

const buildSection = async ({
    programTrackedEntityAttributes,
    trackedEntityAttributes,
    optionSets,
    sectionCustomLabel,
    sectionCustomId,
    querySingleResource,
    minorServerVersion,
}: {
    programTrackedEntityAttributes?: Array<ProgramTrackedEntityAttribute>,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSet>,
    sectionCustomLabel: string,
    sectionCustomId: string,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
}) => {
    if (!programTrackedEntityAttributes?.length) {
        return null;
    }

    const section = new Section((o) => {
        o.id = sectionCustomId;
        o.name = sectionCustomLabel;
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

export const buildFormFoundation = async (program: any, querySingleResource: QuerySingleResource, minorServerVersion: number) => {
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
    if (programSections?.length) {
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

            for (const programSection of programSections) {
                const builtProgramSection = buildProgramSection(programSection);

                // eslint-disable-next-line no-await-in-loop
                section = await buildSection({
                    programTrackedEntityAttributes: builtProgramSection.map(id => trackedEntityAttributeDictionary[id]),
                    trackedEntityAttributes,
                    optionSets,
                    sectionCustomLabel: programSection.displayFormName,
                    sectionCustomId: programSection.id,
                    querySingleResource,
                    minorServerVersion,
                });
                section && renderFoundation.addSection(section);
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
) => {
    const formFoundation = (await buildFormFoundation(program, querySingleResource, minorServerVersion)) || {};
    setFormFoundation && setFormFoundation(formFoundation);
};
