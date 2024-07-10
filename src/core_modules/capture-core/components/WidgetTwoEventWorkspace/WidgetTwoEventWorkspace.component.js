// @flow
import React, { useMemo } from 'react';
import { spacers } from '@dhis2/ui';
import { FlatList } from 'capture-ui';
import { pipe } from 'capture-core-utils';
import withStyles from '@material-ui/core/styles/withStyles';
import { convertClientToView, convertServerToClient } from '../../converters';
import type { RenderFoundation } from '../../metaData';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { getDataEntryDetails, Placements } from './utils/getDataEntryDetails';

type Props = {
    originEventId: string,
    linkedEvent: any,
    dataValues: any,
    formFoundation: RenderFoundation,
    classes: {
        container: string,
    },
}

const styles = {
    container: {
        padding: `${spacers.dp8} ${spacers.dp16}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp8,
    },
};

const convertFn = pipe(convertServerToClient, convertClientToView);


const WidgetTwoEventWorkspacePlain = ({ linkedEvent, dataValues, formFoundation, classes }: Props) => {
    const dataEntryValues = useMemo(() => getDataEntryDetails(
        linkedEvent,
        formFoundation,
    ), [linkedEvent, formFoundation]);

    const listValues = useMemo(() => {
        const elements  = formFoundation.getElements();
        const convertedValues = formFoundation.convertAndGroupBySection(dataValues, convertFn);

        return elements.map((dataElement) => {
            const value = convertedValues[dataElement.id];
            return {
                key: dataElement.formName,
                value: value ? value : '',
                reactKey: dataElement.id,
            };
        }).filter(Boolean)
    }, [dataValues, formFoundation]);

    return (
        <div className={classes.container}>
            <FlatList
                list={[
                    ...dataEntryValues[Placements.TOP],
                    ...listValues,
                    ...dataEntryValues[Placements.BOTTOM]
                ]}
            />
        </div>
    )
};

export const WidgetTwoEventWorkspaceComponent = withStyles(styles)(WidgetTwoEventWorkspacePlain)
