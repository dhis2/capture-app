// @flow
import React, { useCallback } from 'react';
import type { Props } from './teiWorkingListsSetup.types';
import { WorkingLists } from '../../WorkingLists';
import { useDefaultColumnConfig } from './useDefaultColumnConfig';
import { useColumns2 } from '../../WorkingListsCommon/hooks/useColumns';
import type { TeiWorkingListsColumnConfigs } from '../types';

export const TeiWorkingListsSetup = ({
    program,
    onDeleteTemplate,
    onUpdateList,
    customColumnOrder,
    ...passOnProps
}: Props) => {
    const defaultColumns: TeiWorkingListsColumnConfigs = useDefaultColumnConfig(program);
    // $FlowFixMe Any suggestions for how to fix this?
    // const columns = useColumns<TeiWorkingListsColumnConfigs>(customColumnOrder, defaultColumns);
    const b = [{
        header: 'ohmy',
        id: 'vradvgrd',
        visible: false,
        type: 'type1',
    }];

    const columns = useColumns2(defaultColumns);
    const columns2 = useColumns2(b);

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
