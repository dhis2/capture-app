// @flow
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
    onChangeTemplate,
    ...passOnProps
}: Props) => {
    const forceUpdateOnMount = moment().diff(moment(listDataRefreshTimestamp || 0), 'minutes') > 5 ||
        lastTransaction !== lastTransactionOnListDataRefresh;

    const injectCustomUpdateContextToLoadList = useCallback((selectedTemplate: Object, context: Object, meta: Object) =>
        onLoadView(selectedTemplate, { ...context, lastTransaction }, meta),
    [onLoadView, lastTransaction]);

    const injectCustomUpdateContextToUpdateList = useCallback((queryArgs: Object) =>
        onUpdateList(queryArgs, lastTransaction),
    [onUpdateList, lastTransaction]);

    return (
        <WorkingListsBase
            {...passOnProps}
            customUpdateTrigger={customUpdateTrigger}
            forceUpdateOnMount={forceUpdateOnMount}
            onLoadView={injectCustomUpdateContextToLoadList}
            onUpdateList={injectCustomUpdateContextToUpdateList}
            onChangeTemplate={onChangeTemplate}
        />
    );
};
