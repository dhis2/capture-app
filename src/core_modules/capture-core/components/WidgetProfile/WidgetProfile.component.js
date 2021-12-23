// @flow
import React, { useState, useCallback } from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { errorCreator } from 'capture-core-utils';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { convertValue as convertClientToView } from '../../converters/clientToView';
import { convertValue as convertServerToClient } from '../../converters/serverToClient';
import type { Props } from './widgetProfile.types';
import { DataEntry } from './DataEntry';
import { useProgram, useTrackedEntityInstances } from './hooks';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
        justifyContent: 'space-between',
        width: '100%',
    },
};

const WidgetProfilePlain = ({ teiId, programId, showEdit = false, orgUnitId = '', classes }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const [toggleEditModal, setToggleEditModal] = useState(false);
    const { loading: programsLoading, program, error: programsError } = useProgram(programId);
    const {
        loading: trackedEntityInstancesLoading,
        trackedEntityInstances,
        error: trackedEntityInstancesError,
    } = useTrackedEntityInstances(teiId, programId);

    const loading = programsLoading || trackedEntityInstancesLoading;
    const error = programsError || trackedEntityInstancesError;

    const formatValue = (value, valueType) => {
        const convertToClientValue = convertServerToClient(value, valueType);
        return convertClientToView(convertToClientValue, valueType);
    };

    const mergeAttributes = () => {
        const { programTrackedEntityAttributes } = program;
        const { attributes } = trackedEntityInstances;

        return programTrackedEntityAttributes
            .filter(item => item.displayInList)
            .reduce((acc, curr) => {
                const foundAttribute = attributes.find(item => item.attribute === curr.trackedEntityAttribute.id);

                acc.push({
                    reactKey: curr.trackedEntityAttribute.id,
                    key: curr.trackedEntityAttribute.displayName,
                    value: formatValue(foundAttribute?.value, foundAttribute?.valueType),
                });

                return acc;
            }, []);
    };

    const renderProfile = () => {
        if (loading) {
            return <LoadingMaskElementCenter />;
        }

        if (error) {
            log.error(errorCreator('Profile widget could not be loaded')({ error }));
            return <span>{i18n.t('Profile widget could not be loaded. Please try again later')}</span>;
        }

        return <FlatList dataTest="profile-widget-flatlist" list={mergeAttributes()} />;
    };

    return (
        <div data-test="profile-widget">
            <Widget
                header={
                    <div className={classes.header}>
                        <div> {i18n.t('Person Profile')} </div>
                        {showEdit && (
                            <Button onClick={() => setToggleEditModal(true)} small>
                                {i18n.t('Edit')}
                            </Button>
                        )}
                    </div>
                }
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {renderProfile()}
            </Widget>
            {!loading && !error && showEdit && toggleEditModal && (
                <DataEntry
                    onCancel={() => setToggleEditModal(false)}
                    programAPI={program}
                    orgUnitId={orgUnitId}
                    trackedEntityInstanceAttributes={trackedEntityInstances.attributes}
                />
            )}
        </div>
    );
};

export const WidgetProfile: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetProfilePlain);
