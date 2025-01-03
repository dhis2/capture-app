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
        arrow: string,
    }
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    previousValue: {
        color: colors.grey700,
        wordBreak: 'break-word',
    },
    currentValue: {
        color: colors.grey900,
        wordBreak: 'break-word',
        maxWidth: '82%',
    },
    arrow: {
        margin: spacers.dp4,
    },
};

const Updated = ({ previousValue, currentValue, classes }) => (
    <div className={classes.container}>
        <div className={classes.previousValue}>{previousValue}</div>
        <div className={classes.arrow}><IconArrowRight16 /></div>
        <div className={classes.currentValue}>{currentValue}</div>
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
