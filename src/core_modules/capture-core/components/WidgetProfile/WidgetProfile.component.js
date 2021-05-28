// @flow
import React, { type ComponentType, useState, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { errorCreator } from 'capture-core-utils';
import { withStyles } from '@material-ui/core';
import { useDataQuery } from '@dhis2/app-runtime';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { convertValue as convertClientToView } from '../../converters/clientToView';
import { convertValue as convertServerToClient } from '../../converters/serverToClient';
import type { Props } from './widgetProfile.types';

const styles = {
    profileWidgetWrapper: {
        paddingBottom: '12px',
    },
    test: {
        backgroundColor: 'red',
    },

};
const ProfileWidgetPlain = ({ classes, teiId, programId }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const programsQuery = useMemo(() => ({
        programs: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['programTrackedEntityAttributes[id,displayInList,trackedEntityAttribute[id,displayName,valueType]]'],
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

    if (loading) {
        return <LoadingMaskElementCenter />;
    }

    if (error) {
        log.error(errorCreator('Profile widget could not be loaded')({ error }));
        return <span>{i18n.t('Profile widget could not be loaded. Please try again later')}</span>;
    }

    const formatValue = (value, valueType) => {
        const convertToClientValue = convertServerToClient(value, valueType);
        return convertClientToView(convertToClientValue, valueType);
    };

    const mergeAttributes = () => {
        const { programs: { programTrackedEntityAttributes } } = programsData;
        const { trackedEntityInstances: { attributes } } = trackedEntityInstancesData;

        return programTrackedEntityAttributes
            .filter(item => item.displayInList)
            .reduce((acc, curr) => {
                const foundAttribute = attributes
                    .find(item => item.attribute === curr.trackedEntityAttribute.id);

                acc.push({
                    reactKey: curr.trackedEntityAttribute.id,
                    key: curr.trackedEntityAttribute.displayName,
                    value: formatValue(foundAttribute?.value, foundAttribute?.valueType),
                });

                return acc;
            }, []);
    };


    return (
        <div
            data-test="profile-widget"
            className={classes.profileWidgetWrapper}
        >
            <Widget
                header={i18n.t('Person Profile')}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={open}
                className={classes.test}
            >
                <FlatList
                    dataTest="profile-widget-flatlist"
                    list={mergeAttributes()}
                />
            </Widget>
        </div>
    );
};


export const WidgetProfile: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ProfileWidgetPlain);
