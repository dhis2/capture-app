// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useBulkDataEntryFromIndexedDB } from '../../../../../../utils/cachedDataHooks/useBulkDataEntryFromIndexedDB';
import { type Props } from './BulkDataEntryAction.types';
import { BulkDataEntryActionDropdownButton } from './BulkDataEntryActionDropdownButton.component';

const styles = {
    button: {
        whiteSpace: 'nowrap',
    },
};

export const BulkDataEntryActionPlain = ({
    programId,
    setShowBulkDataEntryPlugin,
    selectionInProgress,
    classes,
}: Props & CssClasses) => {
    const { cachedBulkDataEntry } = useBulkDataEntryFromIndexedDB(programId);
    if (cachedBulkDataEntry?.activeList.configKey) {
        return (
            <Button small onClick={() => setShowBulkDataEntryPlugin(true)} className={classes.button}>
                {selectionInProgress
                    ? i18n.t('Add to ongoing bulk data entry')
                    : i18n.t('Add page to ongoing bulk data entry')}
            </Button>
        );
    }

    return (
        <BulkDataEntryActionDropdownButton
            programId={programId}
            setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
            selectionInProgress={selectionInProgress}
        />
    );
};

export const BulkDataEntryAction: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(BulkDataEntryActionPlain);
