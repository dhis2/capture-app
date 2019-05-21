// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../../../../d2/d2Instance';
import {
    RenderFoundation,
    Section,
    TeiRegistration,
    SearchGroup,
    InputSearchGroup,
    DataElement,
} from '../../../../metaData';
import type {
    CachedTrackedEntityType,
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import DataElementFactory from './DataElementFactory';
import { TrackedEntityType } from '../../../../metaData/TrackedEntityType';

class TeiRegistrationFactory {
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

    static _buildTetFeatureTypeField(
        cachedType: CachedTrackedEntityType,
    ) {
        const featureType = cachedType.featureType;
        if (!featureType || !['POINT', 'POLYGON'].includes(featureType)) {
            return null;
        }

        // $FlowFixMe
        return DataElementFactory.buildtetFeatureType(featureType);
    }

    dataElementFactory: DataElementFactory;
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;

    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
    ) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.dataElementFactory = new DataElementFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        );
    }

    async _buildSection(
        cachedType: CachedTrackedEntityType,
    ) {
        const featureTypeField = TeiRegistrationFactory._buildTetFeatureTypeField(cachedType);
        const cachedTrackedEntityTypeAttributes = cachedType.trackedEntityTypeAttributes;
        if ((!cachedTrackedEntityTypeAttributes ||
            cachedTrackedEntityTypeAttributes.length <= 0) &&
            !featureTypeField) {
            return null;
        }

        const section = new Section((_this) => {
            _this.id = Section.MAIN_SECTION_ID;
            _this.name = i18n.t('Profile');
        });

        featureTypeField && section.addElement(featureTypeField);
        if (cachedTrackedEntityTypeAttributes && cachedTrackedEntityTypeAttributes.length > 0) {
            // $FlowFixMe
            await cachedTrackedEntityTypeAttributes.asyncForEach(async (ttea) => {
                const element = await this.dataElementFactory.build(ttea);
                element && section.addElement(element);
            });
        }

        return section;
    }

    async _buildFoundation(
        cachedType: CachedTrackedEntityType,
    ) {
        const foundation = new RenderFoundation((_this) => {
            _this.name = cachedType.displayName;
            _this.id = cachedType.id;
        });

        const section = await this._buildSection(cachedType);
        section && foundation.addSection(section);

        return foundation;
    }

    _buildInputSearchGroupFoundation(
        cachedType: CachedTrackedEntityType,
        searchGroup: SearchGroup,
    ) {
        const typeTeiAttributes = cachedType.trackedEntityTypeAttributes || [];
        const teiAttributesAsObject = typeTeiAttributes.reduce((accTeiAttributes, typeTeiAttribute) => {
            if (!typeTeiAttribute.trackedEntityAttributeId) {
                log.error(
                    errorCreator('TrackedEntityAttributeId missing from trackedEntityTypeAttribute')(
                        { typeTeiAttribute }));
                return accTeiAttributes;
            }
            const teiAttribute = this.cachedTrackedEntityAttributes.get(typeTeiAttribute.trackedEntityAttributeId);
            if (!teiAttribute) {
                log.error(errorCreator('could not retrieve tei attribute')({ typeTeiAttribute }));
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
                const element = TeiRegistrationFactory._buildSearchGroupElement(e, teiAttributesAsObject[e.id]);
                element && section.addElement(element);
            });
        foundation.addSection(section);
        return foundation;
    }

    _buildInputSearchGroups(
        cachedType: CachedTrackedEntityType,
        trackedEntityTypeSearchGroups: Array<SearchGroup>,
    ) {
        const inputSearchGroups: Array<InputSearchGroup> = trackedEntityTypeSearchGroups
            .filter(searchGroup => !searchGroup.unique)
            .map(searchGroup => new InputSearchGroup((_this) => {
                _this.id = searchGroup.id;
                _this.minAttributesRequiredToSearch = searchGroup.minAttributesRequiredToSearch;
                _this.searchFoundation = this._buildInputSearchGroupFoundation(cachedType, searchGroup);
                _this.onSearch = (values: Object = {}, contextProps: Object = {}) => {
                    const { orgUnitId, trackedEntityType } = contextProps;
                    return getApi()
                        .get(
                            'trackedEntityInstances/count.json',
                            {
                                ou: orgUnitId,
                                trackedEntityType,
                                ouMode: 'ACCESSIBLE',
                                filter: Object
                                    .keys(values)
                                    .filter(key => (values[key] || values[key] === 0 || values[key] === false))
                                    .map(key => `${key}:LIKE:${values[key]}`),
                            },
                        );
                    // trackedEntityInstances/count.json?ou=DiszpKrYNg8&ouMode=ACCESSIBLE&trackedEntityType=nEenWmSyUEp&filter=w75KJ2mc4zz:LIKE:kjell&filter=zDhUuAYrxNC:LIKE:haugen&pageSize=1&page=1&totalPages=true
                };
            }));
        return inputSearchGroups;
    }

    async build(
        cachedType: CachedTrackedEntityType,
        trackedEntityTypeSearchGroups: Array<SearchGroup> = [],
        trackedEntityType: TrackedEntityType,
    ) {
        const foundation = await this._buildFoundation(cachedType);
        const inputSearchGroups = this._buildInputSearchGroups(cachedType, trackedEntityTypeSearchGroups);
        // const inputSearchGroups = await this._build
        return new TeiRegistration((_this) => {
            _this.form = foundation;
            _this.inputSearchGroups = inputSearchGroups;
            _this.trackedEntityType = trackedEntityType;
        });
    }
}

export default TeiRegistrationFactory;
