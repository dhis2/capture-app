// @flow
import React from 'react';
import log from 'loglevel';
import { Tag, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { CHANGE_TYPES } from '../../Changelog/Changelog.constants';
import { errorCreator } from '../../../../../../capture-core-utils';

type Props = {
    changeType: $Values<typeof CHANGE_TYPES>,
    classes: {
        container: string,
    },
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
};

const changeTypeConfigs = {
    [CHANGE_TYPES.UPDATED]: { label: i18n.t('Updated'), variant: { neutral: true } },
    [CHANGE_TYPES.CREATED]: { label: i18n.t('Created'), variant: { positive: true } },
    [CHANGE_TYPES.DELETED]: { label: i18n.t('Deleted'), variant: { negative: true } },
};

const ChangelogChangeComponent = ({ label, variant }) => (
    <Tag {...variant}>
        {label}
    </Tag>
);

const ChangelogChangeCellPlain = ({ changeType, classes }: Props) => {
    const config = changeTypeConfigs[changeType];

    if (!config) {
        log.error(errorCreator('Changelog component not found')({ changeType }));
        return null;
    }

    return (
        <div className={classes.container}>
            <ChangelogChangeComponent {...config} />
        </div>
    );
};

export const ChangelogChangeCell = withStyles(styles)(ChangelogChangeCellPlain);
