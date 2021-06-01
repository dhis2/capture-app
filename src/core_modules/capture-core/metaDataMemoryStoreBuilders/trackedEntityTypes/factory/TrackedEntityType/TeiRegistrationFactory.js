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
    InputSearchGroup,
    DataElement,
} from '../../../../metaData';
import type { SearchGroup, TrackedEntityType } from '../../../../metaData';
import type {
    CachedTrackedEntityType,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';
import { DataElementFactory } from './DataElementFactory';
import type { ConstructorInput } from './teiRegistrationFactory.types';

export class TeiRegistrationFactory {
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

    constructor({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
    }: ConstructorInput) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.dataElementFactory = new DataElementFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        });
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

        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
            o.name = i18n.t('Profile');
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
        const foundation = new RenderFoundation((o) => {
            o.name = cachedType.displayName;
            o.id = cachedType.id;
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
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
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
            .map(searchGroup => new InputSearchGroup((o) => {
                o.id = searchGroup.id;
                o.minAttributesRequiredToSearch = searchGroup.minAttributesRequiredToSearch;
                o.searchFoundation = this._buildInputSearchGroupFoundation(cachedType, searchGroup);
                o.onSearch = (values: Object = {}, contextProps: Object = {}) => {
                    const { orgUnitId, trackedEntityTypeId } = contextProps;
                    return getApi()
                        .get(
                            'trackedEntityInstances/count.json',
                            {
                                ou: orgUnitId,
                                trackedEntityType: trackedEntityTypeId,
                                ouMode: 'ACCESSIBLE',
                                filter: Object
                                    .keys(values)
                                    .filter(key => (values[key] || values[key] === 0 || values[key] === false))
                                    .map(key => `${key}:LIKE:${values[key]}`),
                            },
                        );
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
        return new TeiRegistration((o) => {
            o.form = foundation;
            o.inputSearchGroups = inputSearchGroups;
            o.trackedEntityType = trackedEntityType;
        });
    }
}
