// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import type {
    CachedProgram,
    CachedProgramTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../cache.types';
import { RenderFoundation, Section, Enrollment, CustomForm } from '../../../../metaData';
import buildDataElement from './dataElementFactory';
import errorCreator from '../../../../utils/errorCreator';

const errorMessages = {
    CUSTOM_FORM_TEMPLATE_ERROR: 'Error in custom form template',
};
async function buildSection(
    cachedProgramTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>,
    cachedOptionSets: ?Array<CachedOptionSet>,
    locale: ?string,
) {
    const section = new Section((_this) => {
        _this.id = Section.MAIN_SECTION_ID;
        _this.name = i18n.t('Profile');
    });

    await cachedProgramTrackedEntityAttributes.asyncForEach(async (ptea) => {
        section.addElement(await buildDataElement(ptea, cachedOptionSets, locale));
    });

    return section;
}

function addLabels(enrollment: Enrollment, cachedProgram: CachedProgram) {
    if (cachedProgram.enrollmentDateLabel) {
        enrollment.enrollmentDateLabel = cachedProgram.enrollmentDateLabel;
    }
    if (cachedProgram.incidentDateLabel) {
        enrollment.incidentDateLabel = cachedProgram.incidentDateLabel;
    }
}

async function buildEnrollmentForm(
    cachedProgram: CachedProgram,
    cachedOptionSets: ?Array<CachedOptionSet>,
    locale: ?string,
) {
    const enrollmentForm = new RenderFoundation();
    let section;
    if (cachedProgram.programTrackedEntityAttributes && cachedProgram.programTrackedEntityAttributes.length > 0) {
        section = await buildSection(cachedProgram.programTrackedEntityAttributes, cachedOptionSets, locale);
        enrollmentForm.addSection(section);
    }

    if (cachedProgram.dataEntryForm) {
        if (!section) {
            section = new Section((_this) => {
                _this.id = Section.MAIN_SECTION_ID;
            });
        }
        section.showContainer = false;
        const dataEntryForm = cachedProgram.dataEntryForm;
        try {
            enrollmentForm.customForm = new CustomForm((_this) => {
                _this.id = dataEntryForm.id;
                _this.data = dataEntryForm.htmlCode;
            });
        } catch (error) {
            log.error(errorCreator(errorMessages.CUSTOM_FORM_TEMPLATE_ERROR)({
                template: dataEntryForm.htmlCode, error, method: 'buildEnrollment' }));
        }
    }
    return enrollmentForm;
}

export default async function buildEnrollment(
    cachedProgram: CachedProgram,
    cachedOptionSets: ?Array<CachedOptionSet>,
    locale: ?string,
) {
    const enrollment = new Enrollment((_this) => {
        addLabels(_this, cachedProgram);
        _this.trackedEntityType = cachedProgram.trackedEntityType.displayName;
    });

    enrollment.enrollmentForm = await buildEnrollmentForm(cachedProgram, cachedOptionSets, locale);
    return enrollment;
}
