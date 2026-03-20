import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Tooltip, Button } from '@dhis2/ui';
import { buildFilterLabel, truncateFilterLabel } from './filterLabelUtils';

const getStyles = () => ({
    button: {
        cursor: 'not-allowed !important',
    },
});

type Props = {
    title: string;
    valueLabel?: string;
};

const LockedFilterButtonPlain = ({ classes, title, valueLabel = '' }: Props & WithStyles<typeof getStyles>) => {
    const label = useMemo(() => buildFilterLabel(title, valueLabel), [title, valueLabel]);

    return (
        <Tooltip
            content={i18n.t('Locked to{{escape}} {{buttonText}}', {
                escape: ':',
                buttonText: label,
                interpolation: { escapeValue: false },
            })}
            placement={'bottom'}
            openDelay={300}
        >
            <Button
                className={classes.button}
                disabled
            >
                {truncateFilterLabel(label)}
            </Button>
        </Tooltip>
    );
};

export const LockedFilterButton = withStyles(getStyles)(LockedFilterButtonPlain);
