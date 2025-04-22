// @flow
import React, { useMemo } from 'react';
import { TeiWorkingListsSetup } from '../Setup';
import type { CustomActionsContents } from '../../WorkingListsBase';
import type { Props } from './TrackerWorkingListsActionsSetup.types';
import { BulkDataEntryAction } from '../../WorkingListsBase/BulkActionBar';

export const TrackerWorkingListsActionsSetup = ({
    program,
    setShowBulkDataEntryPlugin,
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
                        setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
                        selectionInProgress={selectionInProgress}
                    />
                ),
            },
        ],
        [program, setShowBulkDataEntryPlugin, selectionInProgress],
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
