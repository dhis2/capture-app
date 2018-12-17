// @flow
/* eslint-disable no-underscore-dangle */
import i18n from '@dhis2/d2-i18n';
import {
    TrackedEntityType,
    RenderFoundation,
    Section,
} from '../../../../metaData';
import DataElementFactory from './DataElementFactory';
import type {
    CachedTrackedEntityType,
    CachedTrackedEntityTypeAttribute,
    CachedTrackedEntityTypeTranslation,
    CachedTrackedEntityAttribute,
    CachedOptionSet,
} from '../../../cache.types';

class TrackedEntityTypeFactory {
    static translationPropertyNames = {
        NAME: 'NAME',
        SHORT_NAME: 'SHORT_NAME',
        DESCRIPTION: 'DESCRIPTION',
    };

    locale: ?string;
    dataElementFactory: DataElementFactory;
    constructor(
        cachedTrackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
        cachedOptionSets: Array<CachedOptionSet>,
        locale: ?string,
    ) {
        this.locale = locale;
        this.dataElementFactory = new DataElementFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        );
    }

    _getTranslation(
        translations: Array<CachedTrackedEntityTypeTranslation>,
        property: $Values<typeof TrackedEntityTypeFactory.translationPropertyNames>,
    ) {
        if (this.locale) {
            const translation = translations.find(t => t.property === property && t.locale === this.locale);
            return translation && translation.value;
        }
        return null;
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
        const foundation = new RenderFoundation();
        if (cachedType.trackedEntityTypeAttributes && cachedType.trackedEntityTypeAttributes.length > 0) {
            const section = await this._buildSection(cachedType.trackedEntityTypeAttributes);
            foundation.addSection(section);
        }

        return foundation;
    }

    async build(
        cachedType: CachedTrackedEntityType,
    ) {
        const trackedEntityType = new TrackedEntityType((_this) => {
            _this.id = cachedType.id;
            _this.name = this._getTranslation(
                cachedType.translations, TrackedEntityTypeFactory.translationPropertyNames.NAME)
                || cachedType.displayName;
        });

        trackedEntityType.foundation = await this._buildFoundation(cachedType);


        return trackedEntityType;
    }
}

export default TrackedEntityTypeFactory;
