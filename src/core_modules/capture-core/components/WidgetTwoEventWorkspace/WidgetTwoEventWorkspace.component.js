// @flow
import React, { useMemo } from 'react';
import { spacers } from '@dhis2/ui';
import { FlatList } from 'capture-ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { RenderFoundation } from '../../metaData';
import { getDataEntryDetails, Placements } from './utils/getDataEntryDetails';

type Props = {
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

const WidgetTwoEventWorkspacePlain = ({ linkedEvent, dataValues, formFoundation, classes }: Props) => {
    const dataEntryValues = useMemo(() => getDataEntryDetails(
        linkedEvent,
        formFoundation,
    ), [linkedEvent, formFoundation]);

    const listValues = useMemo(() => {
        const elements = formFoundation.getElements();

        return elements.map((dataElement) => {
            const value = dataValues[dataElement.id];
            return {
                key: dataElement.formName,
                value: value ?? '',
                reactKey: dataElement.id,
            };
        }).filter(Boolean);
    }, [dataValues, formFoundation]);

    return (
        <div className={classes.container}>
            <FlatList
                list={[
                    ...dataEntryValues[Placements.TOP],
                    ...listValues,
                    ...dataEntryValues[Placements.BOTTOM],
                ]}
            />
        </div>
    );
};

export const WidgetTwoEventWorkspaceComponent = withStyles(styles)(WidgetTwoEventWorkspacePlain);
