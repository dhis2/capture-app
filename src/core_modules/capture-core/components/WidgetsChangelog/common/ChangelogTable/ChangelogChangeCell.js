// @flow
import React from 'react';
import log from 'loglevel';
import { colors, IconArrowRight16, spacers, Tag } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { CHANGE_TYPES } from '../Changelog/Changelog.constants';
import { errorCreator } from '../../../../../capture-core-utils';

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
    },
    currentValue: {
        color: colors.grey900,
    },
};

const Updated = ({ previousValue, currentValue, classes }) => (
    <div className={classes.container}>
        <span className={classes.previousValue}>{previousValue}</span>
        <IconArrowRight16 />
        <span className={classes.currentValue}>{currentValue}</span>
    </div>
);

const Created = ({ currentValue, classes }) => (
    <div className={classes.container}>
        <Tag>{i18n.t('Created')}</Tag>
        <span className={classes.currentValue}>{currentValue}</span>
    </div>
);

const Deleted = ({ previousValue, classes }) => (
    <div className={classes.container}>
        <span className={classes.previousValue}>{previousValue}</span>
        <IconArrowRight16 />
        <Tag negative>{i18n.t('Deleted')}</Tag>
    </div>
);

const ChangelogComponentsByType = {
    [CHANGE_TYPES.UPDATED]: Updated,
    [CHANGE_TYPES.CREATED]: Created,
    [CHANGE_TYPES.DELETED]: Deleted,
};

const ChangelogChangeCellPlain = ({ changeType, currentValue, previousValue, classes }: Props) => {
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

export const ChangelogChangeCell = withStyles(styles)(ChangelogChangeCellPlain);
