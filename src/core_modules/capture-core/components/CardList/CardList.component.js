// @flow
import React from 'react';
import type { ComponentType, Element } from 'react';
import { withStyles } from '@material-ui/core';
import { DataElement } from '../../metaData';
import CardListItem from './CardListItem.component';
import makeDataElementsContainerSelector from './CardList.selectors';
import type { SearchResultItem } from "../Pages/Search/SearchResults/SearchResults.types";

export type Item = {|
    id: string,
    values: {
        [elementId: string]: any,
    }
|}

type Props = $ReadOnly<{|
    dataElements: Array<DataElement>,
    items: Array<SearchResultItem>,
    noItemsText?: string,
    itemsLoading?: ?boolean,
    getCustomItemTopElements?: ?(itemProps: Object) => Element<any>,
    getCustomItemBottomElements?: ?(itemProps: Object) => Element<any>,
|}>

const getStyles = (theme: Theme) => ({
    noItemsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
});

const Index = (props: Props & CssClasses) => {
    const {
        classes,
        noItemsText,
        items,
        getCustomItemBottomElements,
        getCustomItemTopElements,
    } = props;

    if (!items || items.length === 0) {
        return (
            <div className={classes.noItemsContainer}>
                {noItemsText}
            </div>
        );
    }

    const dataElementsContainer = makeDataElementsContainerSelector()(props);

    return (
        <div>
            {
                items.map(item => (
                    <CardListItem
                        key={item.id}
                        item={item}
                        getCustomTopElements={getCustomItemTopElements}
                        getCustomBottomElements={getCustomItemBottomElements}
                        {...dataElementsContainer}
                    />
                ))
            }
        </div>
    );
};

Index.defaultProps = {
    itemTypeName: 'item',
};

export const CardList: ComponentType<Props> = withStyles(getStyles)(Index);
