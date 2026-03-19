import moment from 'moment';
import React, { useCallback } from 'react';
import { WorkingListsBase } from '../../WorkingListsBase';
import type { Props } from './eventWorkingListsUpdateTrigger.types';

export const EventWorkingListsUpdateTrigger = ({
    lastTransaction,
    customUpdateTrigger,
    lastIdDeleted,
    listDataRefreshTimestamp,
    lastTransactionOnListDataRefresh,
    onLoadView,
    onUpdateList,
    ...passOnProps
}: Props) => {
    const forceUpdateOnMount = moment().diff(moment(listDataRefreshTimestamp || 0), 'minutes') > 5 ||
        lastTransaction !== lastTransactionOnListDataRefresh;

    const injectCustomUpdateContextToLoadList = useCallback((selectedTemplate: any, context: any, meta: any) =>
        // @ts-expect-error - keeping original functionality as before ts rewrite
        onLoadView(selectedTemplate, { ...context, lastTransaction }, meta),
    [onLoadView, lastTransaction]);

    const injectCustomUpdateContextToUpdateList = useCallback((queryArgs: any) =>
        onUpdateList(queryArgs, lastTransaction),
    [onUpdateList, lastTransaction]);

    return (
        <WorkingListsBase
            {...passOnProps}
            customUpdateTrigger={customUpdateTrigger}
            forceUpdateOnMount={forceUpdateOnMount}
            // @ts-expect-error - keeping original functionality as before ts rewrite
            onLoadView={injectCustomUpdateContextToLoadList}
            onUpdateList={injectCustomUpdateContextToUpdateList}
        />
    );
};
