// @flow
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery, useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { convertValue as convertClientToView } from '../../converters/clientToView';
import { convertValue as convertServerToClient } from '../../converters/serverToClient';
import { subValueGetterByElementType } from './getSubValueForTei';
import type { Props } from './widgetProfile.types';

export const WidgetProfile = ({ teiId, programId }: Props) => {
    const dataEngine = useDataEngine();
    const [open, setOpenStatus] = useState(true);
    const [listAttributes, setListAttributes] = useState([]);
    const programsQuery = useMemo(() => ({
        programs: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['programTrackedEntityAttributes[id,displayInList,trackedEntityAttribute[id,displayName,valueType,optionSet[id,options[code,name]]]'],
            },
        },
    }), [programId]);

    const trackedEntityInstancesQuery = useMemo(() => ({
        trackedEntityInstances: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: {
                program: programId,
            },
        },
    }), [teiId, programId]);


    const {
        loading: programsLoading,
        data: programsData,
        error: programsError,
    } = useDataQuery(programsQuery);
    const {
        loading: trackedEntityInstancesLoading,
        data: trackedEntityInstancesData,
        error: trackedEntityInstancesError,
    } = useDataQuery(trackedEntityInstancesQuery);
    const loading = programsLoading || trackedEntityInstancesLoading;
    const error = programsError || trackedEntityInstancesError;

    const getListAttributes = useCallback(async () => {
        if (programsData && trackedEntityInstancesData) {
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));

            const { programs: { programTrackedEntityAttributes } } = programsData;
            const { trackedEntityInstances: { attributes } } = trackedEntityInstancesData;
            const computedAttributes = await programTrackedEntityAttributes
                .filter(item => item.displayInList)
                .reduce(async (promisedAcc, currentTEA) => {
                    const { displayInList, trackedEntityAttribute: { id, displayName, optionSet } } = currentTEA;
                    const foundAttribute = attributes.find(item => item.attribute === id);
                    let value;
                    if (foundAttribute) {
                        if (subValueGetterByElementType[foundAttribute.valueType]) {
                            value = await subValueGetterByElementType[foundAttribute.valueType](
                                foundAttribute.value, querySingleResource,
                            );
                        } else {
                            value = convertServerToClient(foundAttribute.value, foundAttribute.valueType);
                        }
                    }

                    const acc = await promisedAcc;

                    return [...acc, {
                        reactKey: id,
                        key: displayName,
                        optionSet,
                        displayInList,
                        value,
                        valueType: foundAttribute?.valueType,
                    }];
                }, Promise.resolve([]));

            setListAttributes(computedAttributes);
        }
    }, [programsData, trackedEntityInstancesData, dataEngine]);

    useEffect(() => {
        getListAttributes();
    }, [getListAttributes]);


    const displayInListAttributes = useMemo(() => listAttributes
        .filter(item => item.displayInList)
        .map(({ optionSet, reactKey, key, value: clientValue, valueType }) => {
            let value;
            if (optionSet && optionSet.id) {
                const selectedOption = optionSet.options.find(option => option.code === clientValue);
                value = selectedOption && selectedOption.name;
            } else {
                value = convertClientToView(clientValue, valueType);
            }
            return {
                reactKey, key, value,
            };
        }), [listAttributes]);

    const renderProfile = () => {
        if (loading) {
            return <LoadingMaskElementCenter />;
        }

        if (error) {
            log.error(errorCreator('Profile widget could not be loaded')({ error }));
            return <span>{i18n.t('Profile widget could not be loaded. Please try again later')}</span>;
        }

        return (<FlatList
            dataTest="profile-widget-flatlist"
            list={displayInListAttributes}
        />);
    };

    return (
        <div
            data-test="profile-widget"
        >
            <Widget
                header={i18n.t('Person Profile')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {renderProfile()}
            </Widget>
        </div>
    );
};
