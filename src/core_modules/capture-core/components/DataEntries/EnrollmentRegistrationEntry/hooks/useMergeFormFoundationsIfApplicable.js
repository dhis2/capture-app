// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { RenderFoundation, Section, ProgramStage } from '../../../../metaData';

const addElements = (section, newSection) =>
    Array.from(section.elements.entries())
        .map(entry => entry[1])
        .forEach((element) => {
            // $FlowFixMe[prop-missing] section is missing in FormFieldPluginConfig
            element.section = newSection;
            newSection.addElement(element);
        });

const getSectionId = sectionId =>
    (sectionId === Section.MAIN_SECTION_ID ? `${Section.MAIN_SECTION_ID}-stage` : sectionId);

export const useMergeFormFoundationsIfApplicable = (
    enrollmentFormFoundation?: ?RenderFoundation,
    firstStageMetaData?: ?{ stage: ?ProgramStage },
) => {
    const enrollmentSectionsSize = enrollmentFormFoundation?.sections.size;

    return useMemo(() => {
        const firstStageFormFoundation = firstStageMetaData?.stage?.stageForm;
        if (!enrollmentFormFoundation) {
            return { formFoundation: null };
        }

        if (!firstStageFormFoundation || enrollmentSectionsSize === 0) {
            return { formFoundation: enrollmentFormFoundation };
        }

        const stageName = firstStageMetaData?.stage?.name;
        const { id, name, access, description, featureType, validationStrategy } = enrollmentFormFoundation;
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
                    ? i18n.t('{{ stageName }} - Details', {
                        stageName,
                    })
                    : i18n.t('{{ stageName }} - {{ sectionName }}', {
                        stageName,
                        sectionName: section.name,
                    });
                o.group = Section.groups.EVENT;
                o.customForm = section.customForm;
                o.showContainer = section.showContainer;
                o.open = section.open;
                o.visible = section.visible;
                o.displayDescription = section.displayDescription;
            });
            addElements(section, newSection);
            renderFoundation.addSection(newSection);
        });

        return { formFoundation: renderFoundation };
    }, [enrollmentFormFoundation, firstStageMetaData, enrollmentSectionsSize]);
};
