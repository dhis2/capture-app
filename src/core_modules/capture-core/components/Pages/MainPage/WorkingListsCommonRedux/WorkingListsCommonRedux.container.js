// @flow
import React, { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { WorkingLists } from '../WorkingLists';
import { sortList, setListColumnOrder } from './workingListsCommon.actions';

type Props = {};

export const WorkingListsCommonRedux = (props: Props) => {
    const dispatch = useDispatch();
    const basicDispatch = useMemo(() => actionCreator => (...args) => dispatch(actionCreator(...args)), [dispatch]);

    const handleSort = useCallback(basicDispatch(sortList), [sortList, basicDispatch]);
    const handleSetColumOrder = useCallback(basicDispatch(setListColumnOrder), [setListColumnOrder, basicDispatch]);

    return (
        <WorkingLists
            {...props}
            onSortList={handleSort}
            onSetListColumnOrder={handleSetColumOrder}
        />
    );
};
