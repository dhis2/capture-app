// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import type {
    CachedProgram,
    CachedProgramTrackedEntityAttribute,
    CachedOptionSet,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
} from '../../../../storageControllers/cache.types';
import {
    RenderFoundation,
    Section,
    Enrollment,
    CustomForm,
    TrackedEntityType,
    SearchGroup,
    InputSearchGroup,
} from '../../../../metaData';
import capitalizeFirstLetter from '../../../../utils/string/capitalizeFirstLetter';
import DataElementFactory from './DataElementFactory';
import errorCreator from '../../../../utils/errorCreator';
import { getApi } from '../../../../d2/d2Instance';
import { DataElement } from '../../../../metaData/DataElement';

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

    static _addFlags(enrollment: Enrollment, cachedProgram: CachedProgram) {
        enrollment.allowFutureEnrollmentDate = cachedProgram.selectEnrollmentDatesInFuture;
        enrollment.allowFutureIncidentDate = cachedProgram.selectIncidentDatesInFuture;
        enrollment.showIncidentDate = cachedProgram.displayIncidentDate;
    }

    static _getFeatureType(cachedFeatureType: ?string) {
        return cachedFeatureType ?
            capitalizeFirstLetter(cachedFeatureType.toLowerCase())
            :
            'None';
    }

    locale: ?string;
    dataElementFactory: DataElementFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>;
    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
        locale: ?string,
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    ) {
        this.locale = locale;
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.cachedTrackedEntityTypes = cachedTrackedEntityTypes;
        this.dataElementFactory = new DataElementFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        );
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
        return DataElementFactory.buildtetFeatureType(featureType);
    }

    async _buildSection(
        cachedProgramTrackedEntityAttributes: ?Array<CachedProgramTrackedEntityAttribute>,
        cachedProgramTrackedEntityTypeId: ?string,
    ) {
        const featureTypeField = this._buildTetFeatureTypeField(cachedProgramTrackedEntityTypeId);
        if ((!cachedProgramTrackedEntityAttributes ||
            cachedProgramTrackedEntityAttributes.length <= 0) &&
            !featureTypeField) {
            return null;
        }

        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.name = i18n.t('Profile');
        });

        featureTypeField && section.addElement(featureTypeField);
        if (cachedProgramTrackedEntityAttributes && cachedProgramTrackedEntityAttributes.length > 0) {
            // $FlowFixMe
            await cachedProgramTrackedEntityAttributes.asyncForEach(async (ptea) => {
                const element = await this.dataElementFactory.build(ptea);
                element && section.addElement(element);
            });
        }

        return section;
    }

    async _buildEnrollmentForm(
        cachedProgram: CachedProgram,
    ) {
        const enrollmentForm = new RenderFoundation((o) => {
            o.featureType = EnrollmentFactory._getFeatureType(cachedProgram.featureType);
            o.name = cachedProgram.displayName;
        });

        let section =
            await this._buildSection(cachedProgram.programTrackedEntityAttributes, cachedProgram.trackedEntityTypeId);
        section && enrollmentForm.addSection(section);

        if (cachedProgram.dataEntryForm) {
            if (!section) {
                section = new Section((o) => {
                    o.id = Section.MAIN_SECTION_ID;
                });
            }
            section.showContainer = false;
            const dataEntryForm = cachedProgram.dataEntryForm;
            try {
                enrollmentForm.customForm = new CustomForm((o) => {
                    o.id = dataEntryForm.id;
                    o.data = dataEntryForm.htmlCode;
                });
            } catch (error) {
                log.error(errorCreator(EnrollmentFactory.errorMessages.CUSTOM_FORM_TEMPLATE_ERROR)({
                    template: dataEntryForm.htmlCode, error, method: 'buildEnrollment' }));
            }
        }
        return enrollmentForm;
    }

    static _buildSearchGroupElement(searchGroupElement: DataElement, teiAttribute: Object) {
        const element = new DataElement((o) => {
            o.id = searchGroupElement.id;
            o.name = searchGroupElement.name;
            o.shortName = searchGroupElement.shortName;
            o.formName = searchGroupElement.formName;
            o.description = searchGroupElement.description;
            o.displayInForms = true;
            o.displayInReports = searchGroupElement.displayInReports;
            o.compulsory = searchGroupElement.compulsory;
            o.disabled = searchGroupElement.disabled;
            o.type = teiAttribute.valueType;
            o.optionSet = searchGroupElement.optionSet;
        });
        return element;
    }

    _buildInputSearchGroupFoundation(
        cachedProgram: CachedProgram,
        searchGroup: SearchGroup,
    ) {
        const programTeiAttributes = cachedProgram.programTrackedEntityAttributes || [];
        const teiAttributesAsObject = programTeiAttributes.reduce((accTeiAttributes, programTeiAttribute) => {
            if (!programTeiAttribute.trackedEntityAttributeId) {
                log.error(
                    errorCreator('TrackedEntityAttributeId missing from programTrackedEntityAttribute')(
                        { programTeiAttribute }));
                return accTeiAttributes;
            }
            const teiAttribute = this.cachedTrackedEntityAttributes.get(programTeiAttribute.trackedEntityAttributeId);
            if (!teiAttribute) {
                log.error(errorCreator('could not retrieve tei attribute')({ programTeiAttribute }));
            } else {
                accTeiAttributes[teiAttribute.id] = teiAttribute;
            }
            return accTeiAttributes;
        }, {});

        const searchGroupFoundation = searchGroup.searchForm;

        const foundation = new RenderFoundation();
        const section = new Section((oSection) => {
            oSection.id = Section.MAIN_SECTION_ID;
        });
        Array.from(
            searchGroupFoundation
                .getSection(Section.MAIN_SECTION_ID)
                // $FlowFixMe : there should be one
                .elements
                .entries())
            .map(entry => entry[1])
            .forEach((e) => {
                const element = EnrollmentFactory._buildSearchGroupElement(e, teiAttributesAsObject[e.id]);
                element && section.addElement(element);
            });
        foundation.addSection(section);
        return foundation;
    }

    _buildInputSearchGroups(
        cachedProgram: CachedProgram,
        programSearchGroups: Array<SearchGroup> = [],
    ) {
        const inputSearchGroups: Array<InputSearchGroup> = programSearchGroups
            .filter(searchGroup => !searchGroup.unique)
            .map(searchGroup => new InputSearchGroup((o) => {
                o.id = searchGroup.id;
                o.minAttributesRequiredToSearch = searchGroup.minAttributesRequiredToSearch;
                o.searchFoundation = this._buildInputSearchGroupFoundation(cachedProgram, searchGroup);
                o.onSearch = (values: Object = {}, contextProps: Object = {}) => {
                    const { orgUnitId, program } = contextProps;
                    return getApi()
                        .get(
                            'trackedEntityInstances/count.json',
                            {
                                ou: orgUnitId,
                                program,
                                ouMode: 'ACCESSIBLE',
                                filter: Object
                                    .keys(values)
                                    .filter(key => (values[key] || values[key] === 0 || values[key] === false))
                                    .map(key => `${key}:LIKE:${values[key]}`),
                                pageSize: 1,
                                page: 1,
                                totalPages: true,
                            },
                        );
                    // trackedEntityInstances/count.json?ou=DiszpKrYNg8&ouMode=ACCESSIBLE&trackedEntityType=nEenWmSyUEp&filter=w75KJ2mc4zz:LIKE:kjell&filter=zDhUuAYrxNC:LIKE:haugen&pageSize=1&page=1&totalPages=true
                };
            }));
        return inputSearchGroups;
    }

    async build(
        cachedProgram: CachedProgram,
        programSearchGroups: Array<SearchGroup> = [],
    ) {
        const enrollment = new Enrollment((o) => {
            EnrollmentFactory._addLabels(o, cachedProgram);
            EnrollmentFactory._addFlags(o, cachedProgram);
            if (cachedProgram.trackedEntityTypeId) {
                const trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
                if (trackedEntityType) {
                    o.trackedEntityType = trackedEntityType;
                }
            }
            o.inputSearchGroups = this._buildInputSearchGroups(cachedProgram, programSearchGroups);
        });

        enrollment.enrollmentForm = await this._buildEnrollmentForm(cachedProgram);
        return enrollment;
    }
}

export default EnrollmentFactory;
