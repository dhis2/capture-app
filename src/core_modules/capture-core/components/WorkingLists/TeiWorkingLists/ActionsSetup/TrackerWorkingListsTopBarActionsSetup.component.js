// @flow
import React, { useMemo } from 'react';
import { TeiWorkingListsSetup } from '../Setup';
import type { CustomTopBarActions } from '../../WorkingListsBase';
import type { Props } from './TrackerWorkingListsTopBarActionsSetup.types';
import { BulkDataEntryAction } from '../../WorkingListsCommon';

export const TrackerWorkingListsTopBarActionsSetup = ({
    program,
    onOpenBulkDataEntryPlugin,
    selectionInProgress,
    records,
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
            customTopBarActions={customTopBarActions}
        />
    );
};
