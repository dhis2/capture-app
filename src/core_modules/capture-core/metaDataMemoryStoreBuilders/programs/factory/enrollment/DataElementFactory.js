// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import i18n from '@dhis2/d2-i18n';
import { pipe, errorCreator } from 'capture-core-utils';

import type {
    CachedAttributeTranslation,
    CachedProgramTrackedEntityAttribute,
    CachedTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';
import {
    DataElement,
    DateDataElement,
    DataElementUnique,
    dataElementUniqueScope,
    dataElementTypes,
    Section,
} from '../../../../metaData';
import { OptionSetFactory } from '../../../common/factory';
import { convertFormToClient, convertClientToServer } from '../../../../converters';
import type { ConstructorInput } from './dataElementFactory.types';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import {
    handleUnsupportedMultiText,
} from '../../../common/helpers/dataElement/unsupportedMultiText';
import { escapeString } from '../../../../utils/escapeString';

export class DataElementFactory {
    static translationPropertyNames = {
        NAME: 'NAME',
        DESCRIPTION: 'DESCRIPTION',
        SHORT_NAME: 'SHORT_NAME',
        FORM_NAME: 'FORM_NAME',
    };

    static errorMessages = {
        TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND: 'TrackedEntityAttributeId missing from programTrackedEntityAttribute or trackedEntityAttribute not found',
        MULIT_TEXT_WITH_NO_OPTIONS_SET:
            'could not create the metadata because a MULIT_TEXT without associated option sets was found',
    };

    static onValidateOnScopeTrackedEntityType(
        dataElementUnique: DataElementUnique,
        dataElement: DataElement,
        serverValue: any,
        contextProps: Object = {},
        querySingleResource: QuerySingleResource,
    ) {
        let requestPromise;
        if (dataElementUnique.scope === dataElementUniqueScope.ORGANISATION_UNIT) {
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
                const otherTrackedEntityInstances = apiTrackedEntities.filter(item => item.trackedEntity !== contextProps.trackedEntityInstanceId);
                const trackedEntityInstance = (otherTrackedEntityInstances && otherTrackedEntityInstances[0]) || {};
                const data = {
                    id: trackedEntityInstance.trackedEntity,
                    tetId: trackedEntityInstance.trackedEntityType,
                };

                return {
                    valid: otherTrackedEntityInstances.length === 0,
                    data,
                };
            });
    }

    static buildtetFeatureType(featureType: 'POINT' | 'POLYGON', section: Section) {
        const dataElement = new DataElement((o) => {
            o.section = section;
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

    static _buildDataElementUnique(
        dataElement: DataElement,
        cachedTrackedEntityAttribute: CachedTrackedEntityAttribute,
    ) {
        return new DataElementUnique((o) => {
            o.scope = cachedTrackedEntityAttribute.orgunitScope ?
                dataElementUniqueScope.ORGANISATION_UNIT :
                dataElementUniqueScope.ENTIRE_SYSTEM;

            o.onValidate = (value: any, contextProps: Object = {}, querySingleResource: QuerySingleResource) => {
                const serverValue = pipe(
                    convertFormToClient,
                    convertClientToServer,
                )(value, cachedTrackedEntityAttribute.valueType);

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
                            program: contextProps.programId,
                            orgUnit: orgUnitId,
                            filter: `${dataElement.id}:EQ:${escapeString(serverValue)}`,
                        },
                    });
                } else {
                    requestPromise = querySingleResource({
                        resource: 'tracker/trackedEntities',
                        params: {
                            program: contextProps.programId,
                            ouMode: 'ACCESSIBLE',
                            filter: `${dataElement.id}:EQ:${escapeString(serverValue)}`,
                        },
                    });
                }
                return requestPromise
                    .then((result) => {
                        const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, result);
                        const otherTrackedEntityInstances = apiTrackedEntities.filter(item => item.trackedEntity !== contextProps.trackedEntityInstanceId);
                        if (otherTrackedEntityInstances.length === 0) {
                            return this.onValidateOnScopeTrackedEntityType(
                                o,
                                dataElement,
                                serverValue,
                                contextProps,
                                querySingleResource,
                            );
                        }
                        const trackedEntityInstance = (otherTrackedEntityInstances && otherTrackedEntityInstances[0]) || {};

                        const data = {
                            id: trackedEntityInstance.trackedEntity,
                            tetId: trackedEntityInstance.trackedEntityType,
                        };

                        return {
                            valid: otherTrackedEntityInstances.length === 0,
                            data,
                        };
                    });
            };

            if (cachedTrackedEntityAttribute.pattern) {
                o.generatable = !!cachedTrackedEntityAttribute.pattern;
            }
        });
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

    // eslint-disable-next-line complexity
    async _setBaseProperties(
        dataElement: DataElement,
        cachedProgramTrackedEntityAttribute: CachedProgramTrackedEntityAttribute,
        cachedTrackedEntityAttribute: CachedTrackedEntityAttribute,
    ) {
        dataElement.id = cachedTrackedEntityAttribute.id;
        dataElement.compulsory = cachedProgramTrackedEntityAttribute.mandatory;
        dataElement.code = cachedTrackedEntityAttribute.code;
        dataElement.attributeValues = cachedTrackedEntityAttribute.attributeValues;
        dataElement.inherit = cachedTrackedEntityAttribute.inherit;
        dataElement.name =
            this._getAttributeTranslation(
                cachedTrackedEntityAttribute.translations,
                DataElementFactory.translationPropertyNames.NAME) ||
                cachedTrackedEntityAttribute.displayName;
        dataElement.shortName =
            this._getAttributeTranslation(
                cachedTrackedEntityAttribute.translations,
                DataElementFactory.translationPropertyNames.SHORT_NAME) ||
                cachedTrackedEntityAttribute.displayShortName;
        dataElement.formName =
            this._getAttributeTranslation(
                cachedTrackedEntityAttribute.translations,
                DataElementFactory.translationPropertyNames.FORM_NAME) ||
                cachedTrackedEntityAttribute.displayFormName;
        dataElement.description =
            this._getAttributeTranslation(
                cachedTrackedEntityAttribute.translations,
                DataElementFactory.translationPropertyNames.DESCRIPTION) ||
                cachedTrackedEntityAttribute.description;
        dataElement.displayInForms = true;
        dataElement.displayInReports = cachedProgramTrackedEntityAttribute.displayInList;
        dataElement.disabled = false;
        dataElement.type = cachedTrackedEntityAttribute.valueType;
        dataElement.searchable = cachedProgramTrackedEntityAttribute.searchable;

        if (cachedTrackedEntityAttribute.unique) {
            dataElement.unique = DataElementFactory._buildDataElementUnique(dataElement, cachedTrackedEntityAttribute);
        }

        if (cachedTrackedEntityAttribute.optionSet && cachedTrackedEntityAttribute.optionSet.id) {
            dataElement.optionSet = await this.optionSetFactory.build(
                dataElement,
                cachedTrackedEntityAttribute.optionSet.id,
                cachedProgramTrackedEntityAttribute.renderOptionsAsRadio,
                null,
                value => value,
            );
        }
    }

    async _buildBaseDataElement(
        cachedProgramTrackedEntityAttribute: CachedProgramTrackedEntityAttribute,
        cachedTrackedEntityAttribute: CachedTrackedEntityAttribute,
        section?: Section,
    ) {
        const dataElement = new DataElement();
        dataElement.section = section;
        dataElement.type = cachedTrackedEntityAttribute.valueType;
        await this._setBaseProperties(
            dataElement,
            cachedProgramTrackedEntityAttribute,
            cachedTrackedEntityAttribute,
        );
        return handleUnsupportedMultiText(dataElement, this.minorServerVersion);
    }

    async _buildDateDataElement(
        cachedProgramTrackedEntityAttribute: CachedProgramTrackedEntityAttribute,
        cachedTrackedEntityAttribute: CachedTrackedEntityAttribute,
        section?: Section,
    ) {
        const dateDataElement = new DateDataElement();
        dateDataElement.type = dataElementTypes.DATE;
        dateDataElement.allowFutureDate = cachedProgramTrackedEntityAttribute.allowFutureDate;
        dateDataElement.section = section;
        await this._setBaseProperties(
            dateDataElement,
            cachedProgramTrackedEntityAttribute,
            cachedTrackedEntityAttribute,
        );
        return dateDataElement;
    }

    build(
        cachedProgramTrackedEntityAttribute: CachedProgramTrackedEntityAttribute,
        section?: Section,
    ) {
        const cachedTrackedEntityAttribute = cachedProgramTrackedEntityAttribute.trackedEntityAttributeId &&
            this.cachedTrackedEntityAttributes.get(
                cachedProgramTrackedEntityAttribute.trackedEntityAttributeId,
            );

        if (!cachedTrackedEntityAttribute) {
            log.error(
                errorCreator(
                    DataElementFactory.errorMessages.TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)(
                    { cachedProgramTrackedEntityAttribute }));
            return null;
        }

        return cachedTrackedEntityAttribute.valueType === dataElementTypes.DATE ?
            this._buildDateDataElement(cachedProgramTrackedEntityAttribute, cachedTrackedEntityAttribute, section) :
            this._buildBaseDataElement(cachedProgramTrackedEntityAttribute, cachedTrackedEntityAttribute, section);
    }
}
