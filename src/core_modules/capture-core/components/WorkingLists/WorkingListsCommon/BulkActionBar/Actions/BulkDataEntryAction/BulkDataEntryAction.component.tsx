import React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useBulkDataEntryConfigurations } from '../../../../../common/bulkDataEntry';
import type { Props } from './BulkDataEntryAction.types';
import { BulkDataEntryActionDropdownButton } from './BulkDataEntryActionDropdownButton.component';

const styles: Readonly<any> = {
    button: {
        whiteSpace: 'nowrap',
    },
};

type ComponentProps = Props & WithStyles<typeof styles>;

export const BulkDataEntryActionPlain = ({
    programId,
    onOpenBulkDataEntryPlugin,
    selectionInProgress,
    classes,
}: ComponentProps) => {
    const { activeList } = useBulkDataEntryConfigurations(programId);
    if (activeList?.configKey) {
        return (
            <Button small onClick={onOpenBulkDataEntryPlugin} className={classes.button}>
                {selectionInProgress
                    ? i18n.t('Add to ongoing bulk data entry')
                    : i18n.t('Add page to ongoing bulk data entry')}
            </Button>
        );
    }

    return (
        <BulkDataEntryActionDropdownButton
            programId={programId}
            onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
            selectionInProgress={selectionInProgress}
        />
    );
};

export const BulkDataEntryAction = withStyles(styles)(BulkDataEntryActionPlain);
