// @flow
import React, { type ComponentType, useState, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { FlatList } from 'capture-ui';
import { withStyles } from '@material-ui/core';
import { useDataQuery } from '@dhis2/app-runtime';
import { Widget } from '../Widget';
import { convertValue as convertClientToView } from '../../converters/clientToView';
import { convertValue as convertServerToClient } from '../../converters/serverToClient';
import type { Props } from './widgetProfile.types';


const styles = {
    profileWidgetWrapper: {
        paddingBottom: '12px',
    },

};
const ProfileWidgetPlain = ({ classes, teiId, programId }: Props) => {
    const [open, setOpenStatus] = useState(true);
    const getProgram = useMemo(() => ({
        indicators: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['programTrackedEntityAttributes[id,displayInList,trackedEntityAttribute[id,displayName,valueType]]'],
            },
        },
    }), [programId]);

    const getAttributes = useMemo(() => ({
        indicators: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: {
                program: programId,
            },
        },
    }), [teiId, programId]);


    const { loading: programLoading, data: programQuery, error: programError } = useDataQuery(getProgram);
    const { loading: attributesLoading, data: attributesQuery, error: attributesError } = useDataQuery(getAttributes);
    const loading = programLoading || attributesLoading;
    const error = programError || attributesError;

    if (loading) {
        return <></>;
    }

    if (error) {
        throw error;
    }

    const mergeAttributes = () => {
        const { programTrackedEntityAttributes } = programQuery.indicators;
        const { attributes } = attributesQuery.indicators;
        const displayEntities = programTrackedEntityAttributes
            .filter(item => item.displayInList)
            .reduce((acc, curr) => { acc = [...acc, curr.trackedEntityAttribute]; return acc; }, []);

        const formattedAttributes = [];
        displayEntities.forEach((entity) => {
            const displayAttribute = attributes.find(att => att.attribute === entity.id);
            if (displayAttribute) {
                formattedAttributes.push(
                    { ...entity,
                        value: convertServerToClient(displayAttribute.value, displayAttribute.valueType),
                    });
            }
        });
        return formattedAttributes
            .map(attribute => (
                { id: attribute.id,
                    key: attribute.displayName,
                    children: <>
                        {convertClientToView(attribute.value, attribute.valueType)}
                    </>,
                }));
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
