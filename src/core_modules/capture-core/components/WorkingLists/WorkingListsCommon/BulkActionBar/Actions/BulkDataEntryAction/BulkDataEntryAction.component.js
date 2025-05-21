// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useBulkDataEntryConfigurations } from '../../../../../common/bulkDataEntry';
import { type Props } from './BulkDataEntryAction.types';
import { BulkDataEntryActionDropdownButton } from './BulkDataEntryActionDropdownButton.component';

const styles = {
    button: {
        whiteSpace: 'nowrap',
    },
};

export const BulkDataEntryActionPlain = ({
    programId,
    onOpenBulkDataEntryPlugin,
    selectionInProgress,
    classes,
}: Props & CssClasses) => {
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

export const BulkDataEntryAction: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(BulkDataEntryActionPlain);
