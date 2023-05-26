// @flow
import React, { type ComponentType } from 'react';
import { Button, IconSearch16, IconAdd16, spacersNum, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import type { PlainProps, Props } from './retrieverModeSelector.types';

const styles = {
    container: {
        padding: spacersNum.dp16,
        paddingTop: 0,
    },
    retrieverSelector: {
        display: 'flex',
        gap: spacers.dp8,
    },
};

const RetrieverModeSelectorPlain = ({
    classes,
    onSearchSelected,
    onNewSelected,
    trackedEntityName,
}: PlainProps) => (
    <div className={classes.container}>
        <div className={classes.retrieverSelector}>
            <Button
                className={classes.retrieverSelector}
                onClick={onSearchSelected}
            >
                <IconSearch16 />
                <p>{i18n.t('Link to an existing {{tetName}}', { tetName: trackedEntityName })}</p>
            </Button>
            <Button
                className={classes.retrieverSelector}
                onClick={onNewSelected}
            >
                <IconAdd16 />
                <p>{i18n.t('Create new')}</p>
            </Button>
        </div>
    </div>
);

export const RetrieverModeSelector: ComponentType<Props> = withStyles(styles)(RetrieverModeSelectorPlain);
