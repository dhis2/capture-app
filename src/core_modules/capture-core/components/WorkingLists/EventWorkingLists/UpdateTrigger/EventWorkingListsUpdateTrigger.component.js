// @flow
import moment from 'moment';
import React, { useCallback } from 'react';
import { WorkingLists } from '../../WorkingLists';
import type { Props } from './eventWorkingListsUpdateTrigger.types';

export const EventWorkingListsUpdateTrigger = ({
    lastTransaction,
    lastIdDeleted,
    listDataRefreshTimestamp,
    lastTransactionOnListDataRefresh,
    onLoadView,
    onUpdateList,
    ...passOnProps
}: Props) => {
    const forceUpdateOnMount = moment().diff(moment(listDataRefreshTimestamp || 0), 'minutes') > 5 ||
        lastTransaction !== lastTransactionOnListDataRefresh;

    // Creating a string that will force an update of the list when it changes.
    const customUpdateTrigger = [
        lastTransaction,
        lastIdDeleted,
    ].join('##');

    const injectCustomUpdateContextToLoadList = useCallback((selectedTemplate: Object, context: Object, meta: Object) =>
        onLoadView(selectedTemplate, { ...context, lastTransaction }, meta),
    [onLoadView, lastTransaction]);

    const injectCustomUpdateContextToUpdateList = useCallback((queryArgs: Object) =>
        onUpdateList(queryArgs, lastTransaction),
    [onUpdateList, lastTransaction]);

    return (
        <WorkingLists
            {...passOnProps}
            customUpdateTrigger={customUpdateTrigger}
            forceUpdateOnMount={forceUpdateOnMount}
            onLoadView={injectCustomUpdateContextToLoadList}
            onUpdateList={injectCustomUpdateContextToUpdateList}
        />
    );
};
