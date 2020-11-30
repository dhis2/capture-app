// @flow
import React, { useCallback } from 'react';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingLists } from '../../WorkingLists';
import { useDefaultColumnConfig } from './useDefaultColumnConfig';
import { useColumns } from '../../WorkingListsCommon';
import type { TeiWorkingListsColumnConfigs } from '../types';

export const TeiWorkingListsSetup = ({
    program,
    onDeleteTemplate,
    onUpdateList,
    customColumnOrder,
    ...passOnProps
}: Props) => {
    const defaultColumns = useDefaultColumnConfig(program);
    const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    // ------- DUMMY DATA!!! --------
    const dummyData = {
        dataSource: [],
        rowIdKey: 'dummy',
        onDeleteTemplate: template => onDeleteTemplate(template, program.id),
        onUpdateList: useCallback(queryArgs => onUpdateList(queryArgs, 1, {}), [onUpdateList]),
    };
    // ------------------------------

    return (
        <WorkingLists
            {...passOnProps}
            {...dummyData}
            columns={columns}
            programId={program.id}
        />
    );
};
