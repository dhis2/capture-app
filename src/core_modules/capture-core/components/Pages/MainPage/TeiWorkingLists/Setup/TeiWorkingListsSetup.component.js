// @flow
import React from 'react';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingLists } from '../../WorkingLists';

export const TeiWorkingListsSetup = ({ programId, onDeleteTemplate, onUpdateList, ...passOnProps }: Props) => {
    // ------- DUMMY DATA!!! --------
    const dummyData = {
        columns: [],
        dataSource: [],
        rowIdKey: 'dummy',
        onDeleteTemplate: template => onDeleteTemplate(template, programId),
        onUpdateList: queryArgs => onUpdateList(queryArgs, 1, {}),
    };
    // ------------------------------

    return (
        <WorkingLists
            {...passOnProps}
            {...dummyData}
            programId={programId}
        />
    );
};
