// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import type {
    CachedProgramTrackedEntityAttribute,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import { RenderFoundation, Section } from '../../../../metaData';
import { buildDataElement, buildTetFeatureType } from './DataElement';
import { getProgramTrackedEntityAttributes, getTrackedEntityTypeId } from '../helpers';

const getFeatureType = (featureType: ?string) => (featureType ? capitalizeFirstLetter(featureType.toLowerCase()) : 'None');

const buildTetFeatureTypeField = (trackedEntityType: CachedTrackedEntityType) => {
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

const buildTetFeatureTypeSection = async (programTrackedEntityTypeId: string, trackedEntityType: CachedTrackedEntityType) => {
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

const buildMainSection = async (
    trackedEntityType: CachedTrackedEntityType,
    trackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
    optionSets: Array<CachedOptionSet>,
    programTrackedEntityAttributes?: ?Array<CachedProgramTrackedEntityAttribute>,
) => {
    const section = new Section((o) => {
        o.id = Section.MAIN_SECTION_ID;
        o.name = i18n.t('Profile');
    });

    if (!programTrackedEntityAttributes?.length) {
        return null;
    }

    const featureTypeField = buildTetFeatureTypeField(trackedEntityType);
    featureTypeField && section.addElement(featureTypeField);

    await buildElementsForSection(programTrackedEntityAttributes, trackedEntityAttributes, optionSets, section);
    return section;
};

const buildElementsForSection = async (
    programTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>,
    trackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
    optionSets: Array<CachedOptionSet>,
    section: Section,
) => {
    for (const trackedEntityAttribute of programTrackedEntityAttributes) {
        // eslint-disable-next-line no-await-in-loop
        const element = await buildDataElement(trackedEntityAttribute, trackedEntityAttributes, optionSets);
        element && section.addElement(element);
    }
    return section;
};

const buildSection = async (
    programTrackedEntityAttributes?: Array<CachedProgramTrackedEntityAttribute>,
    trackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
    optionSets: Array<CachedOptionSet>,
    sectionCustomLabel: string,
    sectionCustomId: string,
) => {
    if (!programTrackedEntityAttributes?.length) {
        return null;
    }

    const section = new Section((o) => {
        o.id = sectionCustomId;
        o.name = sectionCustomLabel;
    });

    await buildElementsForSection(programTrackedEntityAttributes, trackedEntityAttributes, optionSets, section);
    return section;
};

export const buildFormFoundation = async (program: any) => {
    const { programSections, trackedEntityType } = program;
    const programTrackedEntityAttributes = getProgramTrackedEntityAttributes(program.programTrackedEntityAttributes);
    const trackedEntityTypeId: string = getTrackedEntityTypeId(program);
    const trackedEntityAttributes = program.programTrackedEntityAttributes.reduce(
        (acc, currentValue) => [...acc, currentValue.trackedEntityAttribute],
        [],
    );
    const optionSets: Array<CachedOptionSet> = trackedEntityAttributes.reduce(
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
            for (const programSection of programSections) {
                const programTrackedEntityAttributesFiltered = programTrackedEntityAttributes.filter(trackedEntityAttribute =>
                    programSection.trackedEntityAttributes.includes(trackedEntityAttribute.trackedEntityAttributeId),
                );
                // eslint-disable-next-line no-await-in-loop
                section = await buildSection(
                    programTrackedEntityAttributesFiltered,
                    trackedEntityAttributes,
                    optionSets,
                    programSection.displayFormName,
                    programSection.id,
                );
                section && renderFoundation.addSection(section);
            }
        }
    } else {
        section = await buildMainSection(trackedEntityType, trackedEntityAttributes, optionSets, programTrackedEntityAttributes);
        section && renderFoundation.addSection(section);
    }
    return renderFoundation;
};

export const build = async (program: any, setFormFoundation?: (formFoundation: RenderFoundation) => void) => {
    const formFoundation = (await buildFormFoundation(program)) || {};
    setFormFoundation && setFormFoundation(formFoundation);
};
