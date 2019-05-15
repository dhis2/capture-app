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
    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
    ) {
        this.locale = locale;
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
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

        // $FlowFixMe
        await cachedProgramTrackedEntityAttributes.asyncForEach(async (ptea) => {
            const element = await this.dataElementFactory.build(ptea);
            element && section.addElement(element);
        });

        return section;
    }

    async _buildEnrollmentForm(
        cachedProgram: CachedProgram,
    ) {
        const enrollmentForm = new RenderFoundation((_this) => {
            _this.featureType = EnrollmentFactory._getFeatureType(cachedProgram.featureType);
            _this.name = cachedProgram.displayName;
        });
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

    static _buildSearchGroupElement(searchGroupElement: DataElement, teiAttribute: Object) {
        const element = new DataElement((_this) => {
            _this.id = searchGroupElement.id;
            _this.name = searchGroupElement.name;
            _this.shortName = searchGroupElement.shortName;
            _this.formName = searchGroupElement.formName;
            _this.description = searchGroupElement.description;
            _this.displayInForms = true;
            _this.displayInReports = searchGroupElement.displayInReports;
            _this.compulsory = searchGroupElement.compulsory;
            _this.disabled = searchGroupElement.disabled;
            _this.type = teiAttribute.valueType;
            _this.optionSet = searchGroupElement.optionSet;
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
        const section = new Section((_thisSection) => {
            _thisSection.id = Section.MAIN_SECTION_ID;
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
            .map(searchGroup => new InputSearchGroup((_this) => {
                _this.id = searchGroup.id;
                _this.minAttributesRequiredToSearch = searchGroup.minAttributesRequiredToSearch;
                _this.searchFoundation = this._buildInputSearchGroupFoundation(cachedProgram, searchGroup);
                _this.onSearch = (values: Object = {}, contextProps: Object = {}) => {
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
        const enrollment = new Enrollment((_this) => {
            EnrollmentFactory._addLabels(_this, cachedProgram);
            EnrollmentFactory._addFlags(_this, cachedProgram);
            if (cachedProgram.trackedEntityTypeId) {
                const trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
                if (trackedEntityType) {
                    _this.trackedEntityType = trackedEntityType;
                }
            }
            _this.inputSearchGroups = this._buildInputSearchGroups(cachedProgram, programSearchGroups);
        });

        enrollment.enrollmentForm = await this._buildEnrollmentForm(cachedProgram);
        return enrollment;
    }
}

export default EnrollmentFactory;
