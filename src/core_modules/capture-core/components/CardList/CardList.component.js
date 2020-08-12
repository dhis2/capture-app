// @flow
import React from 'react';
import type { ComponentType, Element } from 'react';
import { withStyles } from '@material-ui/core';
import { CardListItem } from './CardListItem.component';
import makeDataElementsContainerSelector from './CardList.selectors';
import type { SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';
import type { DataElementsInformation } from '../Pages/Search/SearchResults/SearchResults.component';

type OwnProps = $ReadOnly<{|
    dataElements: DataElementsInformation,
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

const Index = (props: OwnProps & CssClasses) => {
    const {
        classes,
        noItemsText,
        items,
        getCustomItemBottomElements,
        getCustomItemTopElements,
        dataElements,
    } = props;

    if (!items || items.length === 0) {
        return (
            <div className={classes.noItemsContainer}>
                {noItemsText}
            </div>
        );
    }

    const { imageDataElement } = makeDataElementsContainerSelector()(dataElements);

    return (
        <>
            {
                items.map(item => (
                    <CardListItem
                        key={item.id}
                        item={item}
                        getCustomTopElements={getCustomItemTopElements}
                        getCustomBottomElements={getCustomItemBottomElements}
                        imageDataElement={imageDataElement}
                        dataElements={dataElements}
                    />
                ))
            }
        </>
    );
};

Index.defaultProps = {
    itemTypeName: 'item',
};

export const CardList: ComponentType<OwnProps> = withStyles(getStyles)(Index);
