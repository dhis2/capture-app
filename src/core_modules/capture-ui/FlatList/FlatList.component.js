// @flow
import React from 'react';
import cx from 'classnames';
import { colors, spacersNum } from '@dhis2/ui';
import type { Props } from './flatList.types';

export const FlatList = ({ list, dataTest }: Props) => {
    const lastItemKey = list[list.length - 1]?.reactKey;
    /*     const renderItem = item => (
        <div
            key={item.reactKey}
            className={cx('itemRow', { isLastItem: item.reactKey === lastItemKey })}
        >
            <div className="itemKey">{item.key}:</div>
            <div className="itemValue">{item.value}</div>
        </div>
    ); */

    return (
        <>
            <div data-test={dataTest}>
                {list.map(item => (
                    <div
                        key={item.reactKey}
                        className={cx('itemRow', { isLastItem: item.reactKey === lastItemKey })}
                    >
                        <div className="itemKey">{item.key}:</div>
                        <div className="itemValue">{item.value}</div>
                    </div>))}
            </div>
            <style jsx>{`
                .itemRow {
                    border-bottom: 1px solid ${colors.grey300};
                    display: flex;
                    font-size: 14px;
                    line-height: 19px;
                    padding: ${spacersNum.dp12}px 0;
                }
                .itemRow.isLastItem {
                   border-bottom: none;
                }
                .itemKey {
                    flex: 0 0 auto;
                    width: 128px;
                    color: ${colors.grey600};
                    margin-right: 20px;
                    overflow: hidden;
                    word-wrap: break-word;
                    text-overflow: ellipsis;
                    hyphens: auto;
                }
                .itemValue {
                    flex: 1;
                    overflow: hidden;
                    word-wrap: break-word;
                    text-overflow: ellipsis;
                    hyphens: auto;
                }
            `}</style>
        </>
    );
};
