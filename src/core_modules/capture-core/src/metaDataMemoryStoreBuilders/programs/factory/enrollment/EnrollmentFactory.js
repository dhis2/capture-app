// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import type {
    CachedProgram,
    CachedProgramTrackedEntityAttribute,
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';
import { RenderFoundation, Section, Enrollment, CustomForm, TrackedEntityType } from '../../../../metaData';
import DataElementFactory from './DataElementFactory';
import errorCreator from '../../../../utils/errorCreator';

class EnrollmentFactory {
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

    locale: ?string;
    dataElementFactory: DataElementFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;
    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    ) {
        this.locale = locale;
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.dataElementFactory = new DataElementFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        );
    }

    async _buildSection(
        cachedProgramTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>,
    ) {
        const section = new Section((_this) => {
            _this.id = Section.MAIN_SECTION_ID;
            _this.name = i18n.t('Profile');
        });

        await cachedProgramTrackedEntityAttributes.asyncForEach(async (ptea) => {
            const element = await this.dataElementFactory.build(ptea);
            element && section.addElement(element);
        });

        return section;
    }

    async _buildEnrollmentForm(
        cachedProgram: CachedProgram,
    ) {
        const enrollmentForm = new RenderFoundation();
        let section;
        if (cachedProgram.programTrackedEntityAttributes && cachedProgram.programTrackedEntityAttributes.length > 0) {
            section = await this._buildSection(cachedProgram.programTrackedEntityAttributes);
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
                log.error(errorCreator(EnrollmentFactory.errorMessages.CUSTOM_FORM_TEMPLATE_ERROR)({
                    template: dataEntryForm.htmlCode, error, method: 'buildEnrollment' }));
            }
        }
        return enrollmentForm;
    }

    async build(
        cachedProgram: CachedProgram,
    ) {
        const enrollment = new Enrollment((_this) => {
            EnrollmentFactory._addLabels(_this, cachedProgram);
            if (cachedProgram.trackedEntityTypeId) {
                const trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
                if (trackedEntityType) {
                    _this.trackedEntityType = trackedEntityType;
                }
            }
        });

        enrollment.enrollmentForm = await this._buildEnrollmentForm(cachedProgram);
        return enrollment;
    }
}

export default EnrollmentFactory;
