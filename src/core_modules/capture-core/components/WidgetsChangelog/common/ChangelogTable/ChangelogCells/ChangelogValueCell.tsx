import React from 'react';
import log from 'loglevel';
import { colors, IconArrowRight16, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { CHANGE_TYPES } from '../../Changelog/Changelog.constants';
import { errorCreator } from '../../../../../../capture-core-utils';

type OwnProps = {
    changeType: typeof CHANGE_TYPES[keyof typeof CHANGE_TYPES];
    previousValue?: string;
    currentValue?: string;
};

const styles: Readonly<any> = {
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

type Props = OwnProps & WithStyles<typeof styles>;

type ComponentProps = {
    previousValue?: string | null;
    currentValue?: string | null;
    classes: Record<string, string>;
};

const Updated = ({ previousValue, currentValue, classes }: ComponentProps) => (
    <div className={classes.container}>
        <div className={classes.previousValue}>{previousValue}</div>
        <div className={classes.arrow}><IconArrowRight16 /></div>
        <div className={classes.currentValue}>{currentValue}</div>
    </div>
);

const Created = ({ currentValue, classes }: ComponentProps) => (
    <div className={classes.container}>
        <span className={classes.currentValue}>{currentValue}</span>
    </div>
);

const Deleted = ({ previousValue, classes }: ComponentProps) => (
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
