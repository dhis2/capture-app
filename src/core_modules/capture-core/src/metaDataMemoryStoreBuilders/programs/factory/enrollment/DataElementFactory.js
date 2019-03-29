// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { pipe } from 'capture-core-utils';

import type {
    CachedAttributeTranslation,
    CachedProgramTrackedEntityAttribute,
    CachedOptionSet,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';
import {
    DataElement,
    DataElementUnique,
    dataElementUniqueScope,
} from '../../../../metaData';
import { OptionSetFactory } from '../../../common/factory';
import errorCreator from '../../../../utils/errorCreator';
import { convertFormToClient, convertClientToServer } from '../../../../converters';
import { getApi } from '../../../../d2/d2Instance';

class DataElementFactory {
    static translationPropertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
    };

    static errorMessages = {
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'Tracked entity attribute not found',
    };

    locale: ?string;
    optionSetFactory: OptionSetFactory;
    cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>;
    constructor(
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedOptionSets: Map<string, CachedOptionSet>,
        locale: ?string,
    ) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.locale = locale;
        this.optionSetFactory = new OptionSetFactory(
            cachedOptionSets,
            locale,
        );
    }

    _getAttributeTranslation(
        translations: Array<CachedAttributeTranslation>,
        property: $Values<typeof DataElementFactory.translationPropertyNames>,
    ) {
        if (this.locale) {
            const translation = translations.find(t => t.property === property && t.locale === this.locale);
            return translation && translation.value;
        }
        return null;
    }

    async build(
        cachedProgramTrackedEntityAttribute: CachedProgramTrackedEntityAttribute,
    ) {
        const cachedAttribute = cachedProgramTrackedEntityAttribute.trackedEntityAttributeId &&
            this.cachedTrackedEntityAttributes.get(
                cachedProgramTrackedEntityAttribute.trackedEntityAttributeId,
            );

        if (!cachedAttribute) {
            log.error(
                errorCreator(
                    DataElementFactory.errorMessages.TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)(
                    { cachedProgramTrackedEntityAttribute }));
            return null;
        }

        const dataElement = new DataElement((_this) => {
            _this.id = cachedAttribute.id;
            _this.compulsory = cachedProgramTrackedEntityAttribute.mandatory;
            _this.name =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.NAME) ||
                    cachedAttribute.displayName;
            _this.shortName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.SHORT_NAME) ||
                    cachedAttribute.displayShortName;
            _this.formName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.NAME) ||
                    cachedAttribute.displayName;
            _this.description =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.DESCRIPTION) ||
                    cachedAttribute.description;
            _this.displayInForms = true;
            _this.displayInReports = cachedProgramTrackedEntityAttribute.displayInList;
            _this.disabled = false;
            _this.type = cachedAttribute.valueType;
        });

        if (cachedAttribute.unique) {
            dataElement.unique = new DataElementUnique((_this) => {
                _this.scope = cachedAttribute.orgunitScope ?
                    dataElementUniqueScope.ORGANISATION_UNIT :
                    dataElementUniqueScope.ENTIRE_SYSTEM;

                _this.onValidate = (value: any, contextProps: Object = {}) => {
                    const serverValue = pipe(
                        convertFormToClient,
                        convertClientToServer,
                    )(value, cachedAttribute.valueType);
                    let requestPromise;
                    if (_this.scope === dataElementUniqueScope.ORGANISATION_UNIT) {
                        const orgUnitId = contextProps.orgUnitId;
                        requestPromise = getApi()
                            .get(
                                'trackedEntityInstances',
                                {
                                    ou: orgUnitId,
                                    filter: `${dataElement.id}:EQ:${serverValue}`,
                                },
                            );
                    } else {
                        requestPromise = getApi()
                            .get(
                                'trackedEntityInstances',
                                {
                                    ouMode: 'ACCESSIBLE',
                                    filter: `${dataElement.id}:EQ:${serverValue}`,
                                },
                            );
                    }
                    return requestPromise
                        .then(result => result.trackedEntityInstances.length === 0);
                };

                if (cachedAttribute.pattern) {
                    _this.generatable = !!cachedAttribute.pattern;
                }
            });
        }

        if (cachedAttribute.optionSet && cachedAttribute.optionSet.id) {
            dataElement.optionSet = await this.optionSetFactory.build(
                dataElement,
                cachedAttribute.optionSet.id,
                cachedProgramTrackedEntityAttribute.renderOptionsAsRadio,
                null,
                value => value,
            );
        }

        return dataElement;
    }
}

export default DataElementFactory;
