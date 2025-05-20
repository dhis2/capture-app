// @flow
import React, { useMemo } from 'react';
import { TeiWorkingListsSetup } from '../Setup';
import type { CustomActionsContents } from '../../WorkingListsBase';
import type { Props } from './TrackerWorkingListsActionsSetup.types';
import { BulkDataEntryAction } from '../../WorkingListsBase/BulkActionBar';

export const TrackerWorkingListsActionsSetup = ({
    program,
    onOpenBulkDataEntryPlugin,
    selectionInProgress,
    records,
    ...passOnProps
}: Props) => {
    const customActionsContents: CustomActionsContents = useMemo(
        () => [
            {
                key: 'bulkDataEntryAction',
                actionContents: (
                    <BulkDataEntryAction
                        key="bulkDataEntryAction"
                        programId={program?.id}
                        onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                        selectionInProgress={selectionInProgress}
                    />
                ),
            },
        ],
        [program, onOpenBulkDataEntryPlugin, selectionInProgress],
    );

    return (
        <TeiWorkingListsSetup
            {...passOnProps}
            program={program}
            records={records}
            selectionInProgress={selectionInProgress}
            customActionsContents={customActionsContents}
        />
    );
};
