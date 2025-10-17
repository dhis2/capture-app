import React, { useMemo } from 'react';
import { TrackerWorkingListsSetup } from '../Setup';
import type { CustomTopBarActions } from '../../WorkingListsBase';
import type { Props } from './TrackerWorkingListsTopBarActionsSetup.types';
import { BulkDataEntryAction } from '../../WorkingListsCommon';

export const TrackerWorkingListsTopBarActionsSetup = ({
    program,
    onOpenBulkDataEntryPlugin,
    selectionInProgress,
    recordsOrder,
    ...passOnProps
}: Props) => {
    const customTopBarActions: CustomTopBarActions = useMemo(
        () => [
            {
                key: 'bulkDataEntryAction',
                actionContents: (
                    <BulkDataEntryAction
                        key="bulkDataEntryAction"
                        programId={program?.id}
                        onOpenBulkDataEntryPlugin={() =>
                            onOpenBulkDataEntryPlugin && onOpenBulkDataEntryPlugin(recordsOrder)
                        }
                        selectionInProgress={selectionInProgress}
                    />
                ),
            },
        ],
        [program, onOpenBulkDataEntryPlugin, recordsOrder, selectionInProgress],
    );

    return (
        <TrackerWorkingListsSetup
            {...passOnProps}
            program={program}
            recordsOrder={recordsOrder}
            selectionInProgress={selectionInProgress}
            customTopBarActions={customTopBarActions}
        />
    );
};
