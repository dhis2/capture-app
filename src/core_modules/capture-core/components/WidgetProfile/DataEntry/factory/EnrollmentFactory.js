// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import type {
    CachedProgram,
    CachedProgramSection,
    CachedProgramTrackedEntityAttribute,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import type { TrackedEntityType } from '../../../../metaData';
import { Enrollment, RenderFoundation, Section } from '../../../../metaData';
import { DataElementFactory } from './DataElementFactory';

type ConstructorInput = {|
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
    cachedOptionSets: Map<string, CachedOptionSet>,
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
    trackedEntityTypeCollection: Map<string, TrackedEntityType>,
|};

export class EnrollmentFactory {
    static _addLabels(enrollment: Enrollment, cachedProgram: CachedProgram) {
        if (cachedProgram.enrollmentDateLabel) {
            enrollment.enrollmentDateLabel = cachedProgram.enrollmentDateLabel;
        }
        if (cachedProgram.incidentDateLabel) {
            enrollment.incidentDateLabel = cachedProgram.incidentDateLabel;
        }
    }

    static _addFlags(enrollment: Enrollment, cachedProgram: CachedProgram) {
        enrollment.allowFutureEnrollmentDate = cachedProgram.selectEnrollmentDatesInFuture;
        enrollment.allowFutureIncidentDate = cachedProgram.selectIncidentDatesInFuture;
        enrollment.showIncidentDate = cachedProgram.displayIncidentDate;
    }

    static _getFeatureType(cachedFeatureType: ?string) {
        return cachedFeatureType ? capitalizeFirstLetter(cachedFeatureType.toLowerCase()) : 'None';
    }

    dataElementFactory: DataElementFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>;
    constructor({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        cachedTrackedEntityTypes,
        trackedEntityTypeCollection,
    }: ConstructorInput) {
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.cachedTrackedEntityTypes = cachedTrackedEntityTypes;
        this.dataElementFactory = new DataElementFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
        });
    }

    _buildTetFeatureTypeField(trackedEntityTypeId: ?string) {
        const teType = trackedEntityTypeId && this.cachedTrackedEntityTypes.get(trackedEntityTypeId);
        if (!teType) {
            return null;
        }

        const featureType = teType.featureType;
        if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
            return null;
        }

        // $FlowFixMe
        return DataElementFactory.buildTetFeatureType(featureType);
    }

    async _buildTetFeatureTypeSection(cachedProgramTrackedEntityTypeId: string) {
        const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId);
        const trackedEntityType = this.cachedTrackedEntityTypes.get(cachedProgramTrackedEntityTypeId);

        if (!featureTypeField) {
            return null;
        }

        const section = new Section((o) => {
            o.id = cachedProgramTrackedEntityTypeId;
            o.name = trackedEntityType?.displayName || '';
        });

        featureTypeField && section.addElement(featureTypeField);
        return section;
    }

    async _buildMainSection(
        cachedProgramTrackedEntityAttributes?: ?Array<CachedProgramTrackedEntityAttribute>,
        cachedProgramTrackedEntityTypeId?: ?string,
    ) {
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.name = i18n.t('Profile');
        });

        if (!cachedProgramTrackedEntityAttributes?.length) {
            return null;
        }

        if (cachedProgramTrackedEntityTypeId) {
            const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId);
            featureTypeField && section.addElement(featureTypeField);
        }

        await this._buildElementsForSection(cachedProgramTrackedEntityAttributes, section);
        return section;
    }

    async _buildElementsForSection(
        cachedProgramTrackedEntityAttributes: ?Array<CachedProgramTrackedEntityAttribute>,
        section: Section,
    ) {
        // $FlowFixMe
        await cachedProgramTrackedEntityAttributes.asyncForEach(async (trackedEntityAttribute) => {
            const element = await this.dataElementFactory.build(trackedEntityAttribute);
            element && section.addElement(element);
        });
        return section;
    }

    async _buildSection(
        cachedProgramTrackedEntityAttributes?: Array<CachedProgramTrackedEntityAttribute>,
        cachedSectionCustomLabel: string,
        cachedSectionCustomId: string,
    ) {
        if (!cachedProgramTrackedEntityAttributes?.length) {
            return null;
        }

        const section = new Section((o) => {
            o.id = cachedSectionCustomId;
            o.name = cachedSectionCustomLabel;
        });

        await this._buildElementsForSection(cachedProgramTrackedEntityAttributes, section);
        return section;
    }

    async _buildEnrollmentForm(cachedProgram: CachedProgram, cachedProgramSections: ?Array<CachedProgramSection>) {
        const cachedProgramTrackedEntityAttributes = cachedProgram?.programTrackedEntityAttributes;
        const enrollmentForm = new RenderFoundation((o) => {
            o.featureType = EnrollmentFactory._getFeatureType(cachedProgram.featureType);
            o.name = cachedProgram.displayName;
        });

        let section;
        if (cachedProgramSections?.length) {
            if (cachedProgram.trackedEntityTypeId) {
                section = await this._buildTetFeatureTypeSection(cachedProgram.trackedEntityTypeId);
                section && enrollmentForm.addSection(section);
            }

            cachedProgramTrackedEntityAttributes &&
                // $FlowFixMe
                cachedProgramSections.asyncForEach(async (programSection) => {
                    const trackedEntityAttributes = cachedProgramTrackedEntityAttributes.filter(
                        trackedEntityAttribute =>
                            programSection.trackedEntityAttributes.includes(
                                trackedEntityAttribute.trackedEntityAttributeId,
                            ),
                    );
                    section = await this._buildSection(
                        trackedEntityAttributes,
                        programSection.displayFormName,
                        programSection.id,
                    );
                    section && enrollmentForm.addSection(section);
                });
        } else {
            section = await this._buildMainSection(
                cachedProgramTrackedEntityAttributes,
                cachedProgram.trackedEntityTypeId,
            );
            section && enrollmentForm.addSection(section);
        }
        return enrollmentForm;
    }

    async build(cachedProgram: CachedProgram) {
        const enrollment = new Enrollment((o) => {
            EnrollmentFactory._addLabels(o, cachedProgram);
            EnrollmentFactory._addFlags(o, cachedProgram);
            if (cachedProgram.trackedEntityTypeId) {
                const trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
                if (trackedEntityType) {
                    o.trackedEntityType = trackedEntityType;
                }
            }
        });

        enrollment.enrollmentForm = await this._buildEnrollmentForm(cachedProgram, cachedProgram.programSections);
        return enrollment;
    }
}
