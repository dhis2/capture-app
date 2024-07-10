// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { pipe, errorCreator } from 'capture-core-utils';

import type { ProgramTrackedEntityAttribute, TrackedEntityAttribute, OptionSet as OptionSetType } from './types';
import {
    DataElement,
    DateDataElement,
    DataElementUnique,
    dataElementUniqueScope,
    dataElementTypes,
    OptionSet,
    Option,
    optionSetInputTypes as inputTypes,
} from '../../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../../converters';
import { convertOptionSetValue } from '../../../../converters/serverToClient';
import { buildIcon } from '../../../../metaDataMemoryStoreBuilders/common/helpers';
import { OptionGroup } from '../../../../metaData/OptionSet/OptionGroup';
import {
    getFeatureType,
    getDataElement,
    getLabel,
    escapeString,
    handleAPIResponse,
    REQUESTED_ENTITIES,
} from '../helpers';
import {
    handleUnsupportedMultiText,
} from '../../../../metaDataMemoryStoreBuilders/common/helpers/dataElement/unsupportedMultiText';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const OPTION_SET_NOT_FOUND = 'Optionset not found';
const TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND =
    'TrackedEntityAttributeId missing from programTrackedEntityAttribute or trackedEntityAttribute not found';

const onValidateOnScopeTrackedEntityType = (
    dataElementUnique: DataElementUnique,
    dataElement: DataElement,
    serverValue: any,
    contextProps: Object = {},
    querySingleResource: QuerySingleResource,
) => {
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
};

const buildDataElementUnique = (
    dataElement: DataElement,
    trackedEntityAttribute: TrackedEntityAttribute,
    querySingleResource: QuerySingleResource,
) =>
    new DataElementUnique((dataEntry) => {
        dataEntry.scope = trackedEntityAttribute.orgunitScope
            ? dataElementUniqueScope.ORGANISATION_UNIT
            : dataElementUniqueScope.ENTIRE_SYSTEM;

        dataEntry.onValidate = (value: any, contextProps: Object = {}) => {
            const serverValue = pipe(convertFormToClient, convertClientToServer)(
                value,
                trackedEntityAttribute.valueType,
            );

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
            if (dataEntry.scope === dataElementUniqueScope.ORGANISATION_UNIT) {
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
            return requestPromise.then((result) => {
                const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, result);
                const otherTrackedEntityInstances = apiTrackedEntities.filter(item => item.trackedEntity !== contextProps.trackedEntityInstanceId);
                if (otherTrackedEntityInstances.length === 0) {
                    return onValidateOnScopeTrackedEntityType(
                        dataEntry,
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

        if (trackedEntityAttribute.pattern) {
            dataEntry.generatable = !!trackedEntityAttribute.pattern;
        }
    });

const setBaseProperties = async ({
    dataElement,
    optionSets,
    programTrackedEntityAttribute,
    trackedEntityAttribute,
    querySingleResource,
}: {
    dataElement: DataElement,
    optionSets: Array<OptionSetType>,
    programTrackedEntityAttribute: ProgramTrackedEntityAttribute,
    trackedEntityAttribute: TrackedEntityAttribute,
    querySingleResource: QuerySingleResource,
}) => {
    dataElement.id = trackedEntityAttribute.id;
    dataElement.compulsory = programTrackedEntityAttribute.mandatory;
    dataElement.name = trackedEntityAttribute.displayName;
    dataElement.shortName = trackedEntityAttribute.displayShortName;
    dataElement.formName = trackedEntityAttribute.displayFormName;
    dataElement.description = trackedEntityAttribute.description;
    dataElement.displayInForms = true;
    dataElement.displayInReports = programTrackedEntityAttribute.displayInList;
    dataElement.disabled = false;
    dataElement.type = trackedEntityAttribute.valueType;
    dataElement.searchable = programTrackedEntityAttribute.searchable;

    if (trackedEntityAttribute.unique) {
        dataElement.unique = buildDataElementUnique(dataElement, trackedEntityAttribute, querySingleResource);
    }

    if (trackedEntityAttribute.optionSet && trackedEntityAttribute.optionSet.id) {
        dataElement.optionSet = await buildOptionSet(
            dataElement,
            optionSets,
            trackedEntityAttribute.optionSet.id,
            programTrackedEntityAttribute.renderOptionsAsRadio,
        );
    }
};

const buildBaseDataElement = async (
    optionSets: Array<OptionSetType>,
    programTrackedEntityAttribute: ProgramTrackedEntityAttribute,
    trackedEntityAttribute: TrackedEntityAttribute,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
) => {
    const dataElement = new DataElement();
    dataElement.type = trackedEntityAttribute.valueType;
    await setBaseProperties({
        dataElement,
        optionSets,
        programTrackedEntityAttribute,
        trackedEntityAttribute,
        querySingleResource,
    });

    return handleUnsupportedMultiText(dataElement, minorServerVersion);
};

const buildDateDataElement = async (
    optionSets: Array<OptionSetType>,
    programTrackedEntityAttribute: ProgramTrackedEntityAttribute,
    trackedEntityAttribute: TrackedEntityAttribute,
    querySingleResource: QuerySingleResource,
) => {
    const dateDataElement = new DateDataElement();
    dateDataElement.type = dataElementTypes.DATE;
    dateDataElement.allowFutureDate = programTrackedEntityAttribute.allowFutureDate;
    await setBaseProperties({
        dataElement: dateDataElement,
        optionSets,
        programTrackedEntityAttribute,
        trackedEntityAttribute,
        querySingleResource,
    });
    return dateDataElement;
};

const buildOptionSet = async (
    dataElement: DataElement,
    optionSets: Array<OptionSetType>,
    optionSetId: string,
    renderOptionsAsRadio: ?boolean,
) => {
    const optionSetAPI = optionSets.find(optionSet => optionSet.id === optionSetId);

    if (!optionSetAPI) {
        log.warn(errorCreator(OPTION_SET_NOT_FOUND)({ id: optionSetId }));
        return null;
    }
    dataElement.type = optionSetAPI.valueType;

    const optionsPromises = optionSetAPI.options.map(async (optionSetOption) => {
        const icon = buildIcon(optionSetOption.style);
        return new Option((option) => {
            option.id = optionSetOption.id;
            option.value = optionSetOption.code;
            option.text = optionSetOption.displayName;
            option.icon = icon;
        });
    });

    const options = await Promise.all(optionsPromises);

    const optionGroups =
        optionSetAPI.optionGroups &&
        new Map(
            optionSetAPI.optionGroups.map(group => [
                group.id,
                new OptionGroup((o) => {
                    o.id = group.id;
                    o.optionIds = new Map(group.options.map(option => [option, option]));
                }),
            ]),
        );

    const optionSet = new OptionSet(
        optionSetAPI.id,
        options,
        optionGroups,
        dataElement,
        convertOptionSetValue,
        optionSetAPI.attributeValues,
    );
    optionSet.inputType = renderOptionsAsRadio ? inputTypes.VERTICAL_RADIOBUTTONS : null;
    return optionSet;
};

export const buildTetFeatureType = (featureType: 'POINT' | 'POLYGON') => {
    const dataElement = new DataElement((dataEntry) => {
        dataEntry.id = getFeatureType(featureType);
        dataEntry.name = i18n.t(getLabel(featureType));
        dataEntry.formName = dataEntry.name;
        dataEntry.compulsory = false;
        dataEntry.displayInForms = true;
        dataEntry.disabled = false;
        dataEntry.type = getDataElement(featureType);
    });
    return dataElement;
};

export const buildDataElement = (
    programTrackedEntityAttribute: ProgramTrackedEntityAttribute,
    trackedEntityAttributes: Array<TrackedEntityAttribute>,
    optionSets: Array<OptionSetType>,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
) => {
    const trackedEntityAttribute =
        programTrackedEntityAttribute.trackedEntityAttributeId &&
        trackedEntityAttributes.find(
            trackedEntityAttributeAPI =>
                trackedEntityAttributeAPI.id === programTrackedEntityAttribute.trackedEntityAttributeId,
        );

    if (!trackedEntityAttribute) {
        log.error(
            errorCreator(TRACKED_ENTITY_ATTRIBUTE_NOT_FOUND)({
                programTrackedEntityAttribute,
            }),
        );
        return null;
    }

    return trackedEntityAttribute.valueType === dataElementTypes.DATE
        ? buildDateDataElement(optionSets, programTrackedEntityAttribute, trackedEntityAttribute, querySingleResource)
        : buildBaseDataElement(optionSets, programTrackedEntityAttribute, trackedEntityAttribute, querySingleResource, minorServerVersion);
};
