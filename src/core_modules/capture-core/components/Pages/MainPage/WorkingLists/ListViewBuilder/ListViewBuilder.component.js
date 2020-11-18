// @flow
import React, { useContext } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { ListView } from '../../../../ListView';
import { ListViewBuilderContext } from '../workingLists.context';
import type { Props } from './listViewBuilder.types';


// eslint-disable-next-line complexity
export const ListViewBuilder = ({ customListViewMenuContents, ...passOnProps }: Props) => {
    const context = useContext(ListViewBuilderContext);
    if (!context) {
        throw Error('missing ListViewBuilderContext');
    }

    const {
        dataSource,
        onSelectListRow,
        onSortList,
        onSetListColumnOrder,
        rowsCount,
        stickyFilters,
        ...passOnContext
    } = context;

    if (!dataSource || rowsCount == null || !stickyFilters) {
        const baseErrorMessage = 'dataSource, rowsCount, stickyFilters needs to be set in ListViewBuilder';
        log.error(
            errorCreator(baseErrorMessage)(
                { dataSource, rowsCount, stickyFilters }));
        throw Error(`${baseErrorMessage}. See console for details`);
    }

    return (
        <ListView
            {...passOnProps}
            {...passOnContext}
            dataSource={dataSource}
            onSelectRow={onSelectListRow}
            onSort={onSortList}
            onSetColumnOrder={onSetListColumnOrder}
            customMenuContents={customListViewMenuContents}
            rowsCount={rowsCount}
            stickyFilters={stickyFilters}
        />
    );
};
