// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import i18n from '@dhis2/d2-i18n';
import { pipe, errorCreator } from 'capture-core-utils';
import type {
    CachedAttributeTranslation,
    CachedTrackedEntityTypeAttribute,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';
import {
    DataElement,
    DataElementUnique,
    dataElementUniqueScope,
    dataElementTypes,
} from '../../../../metaData';
import { OptionSetFactory } from '../../../common/factory';
import { convertFormToClient, convertClientToServer } from '../../../../converters';
import type { ConstructorInput } from './dataElementFactory.types';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import { escapeString } from '../../../../utils/escapeString';
import {
    handleUnsupportedMultiText,
} from '../../../../metaDataMemoryStoreBuilders/common/helpers/dataElement/unsupportedMultiText';

export class DataElementFactory {
    static translationPropertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
        FORM_NAME: 'FORM_NAME',
    };

    static errorMessages = {
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'TrackedEntityAttributeId missing from trackedEntityTypeAttribute or trackedEntityAttribute not found',
        MULIT_TEXT_WITH_NO_OPTIONS_SET:
            'could not create the metadata because a MULIT_TEXT without associated option sets was found',
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
    minorServerVersion: number;
    constructor({
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        locale,
        minorServerVersion,
    }: ConstructorInput) {
        this.cachedTrackedEntityAttributes = cachedTrackedEntityAttributes;
        this.locale = locale;
        this.optionSetFactory = new OptionSetFactory(
            cachedOptionSets,
            locale,
        );
        this.minorServerVersion = minorServerVersion;
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
        cachedTrackedEntityTypeAttribute: CachedTrackedEntityTypeAttribute,
    ): Promise<DataElement | null> {
        const cachedAttribute = cachedTrackedEntityTypeAttribute.trackedEntityAttributeId &&
            this.cachedTrackedEntityAttributes.get(
                cachedTrackedEntityTypeAttribute.trackedEntityAttributeId,
            );

        if (!cachedAttribute) {
            log.error(
                errorCreator(
                    DataElementFactory.errorMessages.TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)(
                    { cachedTrackedEntityTypeAttribute }));
            return null;
        }

        const dataElement = new DataElement((o) => {
            o.id = cachedAttribute.id;
            o.compulsory = cachedTrackedEntityTypeAttribute.mandatory;
            o.code = cachedAttribute.code;
            o.name =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.NAME) ||
                    cachedAttribute.displayName;
            o.shortName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.SHORT_NAME) ||
                    cachedAttribute.displayShortName;
            o.formName =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.FORM_NAME) ||
                    cachedAttribute.displayFormName;
            o.description =
                this._getAttributeTranslation(
                    cachedAttribute.translations, DataElementFactory.translationPropertyNames.DESCRIPTION) ||
                    cachedAttribute.description;
            o.displayInForms = true;
            o.inherit = cachedAttribute.inherit;
            o.displayInReports = cachedTrackedEntityTypeAttribute.displayInList;
            o.disabled = false;
            o.type = cachedAttribute.valueType;
        });

        if (cachedAttribute.unique) {
            dataElement.unique = new DataElementUnique((o) => {
                o.scope = cachedAttribute.orgunitScope ?
                    dataElementUniqueScope.ORGANISATION_UNIT :
                    dataElementUniqueScope.ENTIRE_SYSTEM;

                o.onValidate = (value: any, contextProps: Object = {}, querySingleResource: QuerySingleResource) => {
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
                        requestPromise = querySingleResource({
                            resource: 'tracker/trackedEntities',
                            params: {
                                trackedEntityType: contextProps.trackedEntityTypeId,
                                orgUnit: orgUnitId,
                                filter: `${dataElement.id}:EQ:${escapeString(serverValue)}`,
                            },
                        });
                    } else {
                        requestPromise = querySingleResource({
                            resource: 'tracker/trackedEntities',
                            params: {
                                trackedEntityType: contextProps.trackedEntityTypeId,
                                ouMode: 'ACCESSIBLE',
                                filter: `${dataElement.id}:EQ:${escapeString(serverValue)}`,
                            },
                        });
                    }
                    return requestPromise
                        .then((result) => {
                            const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, result);
                            const trackedEntityInstance = apiTrackedEntities[0] || {};
                            const data = {
                                id: trackedEntityInstance.trackedEntity,
                                tetId: trackedEntityInstance.trackedEntityType,
                            };

                            return {
                                valid: apiTrackedEntities.length === 0,
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
                null,
                null,
                value => value,
            );
        }

        return handleUnsupportedMultiText(dataElement, this.minorServerVersion);
    }
}
