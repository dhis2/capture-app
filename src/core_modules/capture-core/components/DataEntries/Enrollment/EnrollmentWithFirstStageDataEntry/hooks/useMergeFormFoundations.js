// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { RenderFoundation, Section } from '../../../../../metaData';

const addElements = (section, newSection) =>
    Array.from(section.elements.entries())
        .map(entry => entry[1])
        .forEach((element) => {
            newSection.addElement(element);
        });

const getSectionId = sectionId =>
    (sectionId === Section.MAIN_SECTION_ID ? `${Section.MAIN_SECTION_ID}-stage` : sectionId);

export const useMergeFormFoundations = (
    enrollmentFormFoundation: RenderFoundation,
    firstStageFormFoundation: RenderFoundation,
    stageName: string,
) =>
    useMemo(() => {
        const { id, name, access, description, featureType, validationStrategy } = enrollmentFormFoundation;
        // $FlowFixMe[incompatible-type]
        const [[firstSectionId]] = firstStageFormFoundation.sections;
        const renderFoundation = new RenderFoundation((o) => {
            o.id = id;
            o.name = name;
            o.access = access;
            o.description = description;
            o.featureType = featureType;
            o.validationStrategy = validationStrategy;
        });

        enrollmentFormFoundation.sections.forEach(section => renderFoundation.addSection(section));

        firstStageFormFoundation.sections.forEach((section) => {
            const isMainSection = section.id === Section.MAIN_SECTION_ID;
            const newSection = new Section((o) => {
                o.id = getSectionId(section.id);
                o.name = isMainSection
                    ? i18n.t('Data Entry ({{ stageName }})', {
                        stageName,
                    })
                    : i18n.t('Data Entry ({{ stageName }} - {{ sectionName }})', {
                        stageName,
                        sectionName: section.name,
                    });
            });
            addElements(section, newSection);
            renderFoundation.addSection(newSection);
        });

        return { formFoundation: renderFoundation, beforeSectionId: getSectionId(firstSectionId) };
    }, [enrollmentFormFoundation, firstStageFormFoundation.sections, stageName]);
