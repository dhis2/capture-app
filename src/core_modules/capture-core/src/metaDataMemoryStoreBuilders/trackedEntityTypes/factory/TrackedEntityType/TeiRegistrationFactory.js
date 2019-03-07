// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import {
    RenderFoundation,
    Section,
    TeiRegistration,
    SearchGroup,
    InputSearchGroup,
} from '../../../../metaData';
import type {
    CachedTrackedEntityType,
    CachedTrackedEntityTypeAttribute,
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import DataElementFactory from './DataElementFactory';

class TeiRegistrationFactory {
    dataElementFactory: DataElementFactory;

    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
    ) {
        this.dataElementFactory = new DataElementFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        );
    }

    async _buildSection(
        cachedTrackedEntityTypeAttributes: Array<CachedTrackedEntityTypeAttribute>,
    ) {
        const section = new Section((_this) => {
            _this.id = Section.MAIN_SECTION_ID;
            _this.name = i18n.t('Profile');
        });

        // $FlowFixMe
        await cachedTrackedEntityTypeAttributes.asyncForEach(async (ttea) => {
            const element = await this.dataElementFactory.build(ttea);
            element && section.addElement(element);
        });

        return section;
    }

    async _buildFoundation(
        cachedType: CachedTrackedEntityType,
    ) {
        const foundation = new RenderFoundation((_this) => {
            _this.name = cachedType.displayName;
            _this.id = cachedType.id;
        });
        if (cachedType.trackedEntityTypeAttributes && cachedType.trackedEntityTypeAttributes.length > 0) {
            const section = await this._buildSection(cachedType.trackedEntityTypeAttributes);
            foundation.addSection(section);
        }

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
        cachedType: CachedTrackedEntityType,
        trackedEntityTypeSearchGroups: Array<SearchGroup> = [],
    ) {
        const foundation = await this._buildFoundation(cachedType);
        // const inputSearchGroups = await this._build
        return new TeiRegistration((_this) => {
            _this.form = foundation;
        });
    }
}

export default TeiRegistrationFactory;
