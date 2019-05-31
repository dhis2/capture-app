// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
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
    dataElementTypes,
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
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'TrackedEntityAttributeId missing from programTrackedEntityAttribute or trackedEntityAttribute not found',
    };

    static buildtetFeatureType(featureType: 'POINT' | 'POLYGON') {
        const dataElement = new DataElement((o) => {
            o.id = `FEATURETYPE_${featureType}`;
            o.name = featureType === 'POINT' ? i18n.t('Coordinate') : i18n.t('Area');
            o.formName = o.name;
            o.compulsory = false;
            o.displayInForms = true;
            o.disabled = false;
            o.type = featureType === 'POINT' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON;
        });
        return dataElement;
    }

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

        const dataElement = new DataElement((o) => {
            o.id = cachedAttribute.id;
            o.compulsory = cachedProgramTrackedEntityAttribute.mandatory;
            o.name =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.NAME) ||
                    cachedAttribute.displayName;
            o.shortName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.SHORT_NAME) ||
                    cachedAttribute.displayShortName;
            o.formName = o.name;
            o.description =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.DESCRIPTION) ||
                    cachedAttribute.description;
            o.displayInForms = true;
            o.displayInReports = cachedProgramTrackedEntityAttribute.displayInList;
            o.disabled = false;
            o.type = cachedAttribute.valueType;
        });

        if (cachedAttribute.unique) {
            dataElement.unique = new DataElementUnique((o) => {
                o.scope = cachedAttribute.orgunitScope ?
                    dataElementUniqueScope.ORGANISATION_UNIT :
                    dataElementUniqueScope.ENTIRE_SYSTEM;

                o.onValidate = (value: any, contextProps: Object = {}) => {
                    const serverValue = pipe(
                        convertFormToClient,
                        convertClientToServer,
                    )(value, cachedAttribute.valueType);

                    if (contextProps.onGetUnsavedAttributeValues) {
                        const unsavedAttributeValues = contextProps.onGetUnsavedAttributeValues(dataElement.id);
                        if (unsavedAttributeValues) {
                            const foundValue = unsavedAttributeValues.find(usav => usav === serverValue);
                            if (foundValue) {
                                return {
                                    valid: false,
                                    data: {
                                        attributeValueExistsUnsaved: true,
                                    },
                                };
                            }
                        }
                    }


                    let requestPromise;
                    if (o.scope === dataElementUniqueScope.ORGANISATION_UNIT) {
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
                        .then((result) => {
                            const trackedEntityInstance =
                                (result.trackedEntityInstances && result.trackedEntityInstances[0]) || {};
                            const data = {
                                id: trackedEntityInstance.trackedEntityInstance,
                                tetId: trackedEntityInstance.trackedEntityType,
                            };

                            return {
                                valid: result.trackedEntityInstances.length === 0,
                                data,
                            };
                        });
                };

                if (cachedAttribute.pattern) {
                    o.generatable = !!cachedAttribute.pattern;
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
