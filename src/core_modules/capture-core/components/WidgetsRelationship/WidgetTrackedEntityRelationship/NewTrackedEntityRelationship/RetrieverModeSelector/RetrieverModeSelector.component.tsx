import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';
import type { PlainProps } from './retrieverModeSelector.types';

const styles: Readonly<any> = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 8,
    },
    button: {
        alignSelf: 'flex-start' as const,
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const RetrieverModeSelectorPlain = ({
    onSearchSelected,
    onNewSelected,
    trackedEntityName,
    classes,
}: Props) => (
    <div className={classes.container}>
        <Button
            className={classes.button}
            onClick={onSearchSelected}
        >
            {i18n.t('Search for existing {{trackedEntityName}}', {
                trackedEntityName: trackedEntityName.toLowerCase(),
            }) as string}
        </Button>
        <Button
            className={classes.button}
            onClick={onNewSelected}
        >
            {i18n.t('Create new {{trackedEntityName}}', {
                trackedEntityName: trackedEntityName.toLowerCase(),
            }) as string}
        </Button>
    </div>
);

export const RetrieverModeSelector = withStyles(styles)(RetrieverModeSelectorPlain);
