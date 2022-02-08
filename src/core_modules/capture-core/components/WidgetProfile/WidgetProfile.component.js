// @flow
import React, { useState, useCallback, useMemo } from 'react';
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
import type { Props } from './widgetProfile.types';
import { DataEntry } from './DataEntry';
import { useProgram, useTrackedEntityInstances, useClientAttributesWithSubvalues } from './hooks';

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

    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(program, trackedEntityInstances);

    const displayInListAttributes = useMemo(() => clientAttributesWithSubvalues
        .filter(item => item.displayInList)
        .map(({ optionSet, attribute, key, value: clientValue, valueType }) => {
            let value;
            if (optionSet && optionSet.id) {
                const selectedOption = optionSet.options.find(option => option.code === clientValue);
                value = selectedOption && selectedOption.name;
            } else {
                value = convertClientToView(clientValue, valueType);
            }
            return {
                attribute, key, value,
            };
        }), [clientAttributesWithSubvalues]);

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
                    clientAttributesWithSubvalues={clientAttributesWithSubvalues}
                />
            )}
        </div>
    );
};

export const WidgetProfile: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetProfilePlain);
