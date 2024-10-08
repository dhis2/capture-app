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
    }
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
    previousValue: {
        color: colors.grey700,
        maxWidth: '50%',
    },
    currentValue: {
        color: colors.grey900,
        maxWidth: '50%',
    },
};

const Updated = ({ previousValue, currentValue, classes }) => (
    <div className={classes.container}>
        <span className={classes.previousValue}>{previousValue}</span>
        <span><IconArrowRight16 /></span>
        <span className={classes.currentValue}>{currentValue}</span>
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
