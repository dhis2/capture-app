// @flow
import React from 'react';
import log from 'loglevel';
import { colors, IconArrowRight16, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { CHANGE_TYPES } from '../../Changelog/Changelog.constants';
import { errorCreator } from '../../../../../../capture-core-utils';

type Props = {
    changeType: $Values<typeof CHANGE_TYPES>,
    previousValue?: string,
    currentValue?: string,
    classes: {
        container: string,
        previousValue: string,
        currentValue: string,
        updatePreviousValue: string,
        updateCurrentValue: string,
        updateArrow: string,
    }
}

const styles = {
    container: {
        alignItems: 'center',
        display: 'flex',
    },
    previousValue: {
        color: colors.grey700,
    },
    currentValue: {
        color: colors.grey900,
    },
    updatePreviousValue: {
        color: colors.grey700,
        maxWidth: '45%',
    },
    updateCurrentValue: {
        color: colors.grey900,
        maxWidth: '45%',
    },
    updateArrow: {
        display: 'inline-flex',
        alignItems: 'center',
        margin: `${spacers.dp4}`,
    },
};

const Updated = ({ previousValue, currentValue, classes }) => (
    <div className={classes.container}>
        <span className={classes.updatePreviousValue}>{previousValue}</span>
        <span className={classes.updateArrow}><IconArrowRight16 /></span>
        <span className={classes.updateCurrentValue}>{currentValue}</span>
    </div>
);

const Created = ({ currentValue, classes }) => (
    <div className={classes.container}>
        <span className={classes.currentValue}>{currentValue}</span>
    </div>
);

const Deleted = ({ previousValue, classes }) => (
    <div className={classes.container}>
        <span className={classes.previousValue}>{previousValue}</span>
    </div>
);

const ChangelogComponentsByType = {
    [CHANGE_TYPES.UPDATED]: Updated,
    [CHANGE_TYPES.CREATED]: Created,
    [CHANGE_TYPES.DELETED]: Deleted,
};

const ChangelogValueCellPlain = ({ changeType, currentValue, previousValue, classes }: Props) => {
    const ChangelogComponent = ChangelogComponentsByType[changeType];

    if (!ChangelogComponent) {
        log.error(errorCreator('Changelog component not found')({ changeType }));
        return null;
    }

    return (
        <ChangelogComponent
            classes={classes}
            previousValue={previousValue}
            currentValue={currentValue}
        />
    );
};

export const ChangelogValueCell = withStyles(styles)(ChangelogValueCellPlain);
