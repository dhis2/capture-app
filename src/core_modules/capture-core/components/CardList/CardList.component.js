// @flow
import React from 'react';
import type { ComponentType, Element } from 'react';
import { withStyles } from '@material-ui/core';
import { CardListItem } from './CardListItem.component';
import { makeElementsContainerSelector } from './CardList.selectors';
import type { CardDataElementsInformation, SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';

type OwnProps = $ReadOnly<{|
    dataElements: CardDataElementsInformation,
    items: Array<SearchResultItem>,
    getCustomItemTopElements?: ?(itemProps: Object) => Element<any>,
    getCustomItemBottomElements?: ?(itemProps: Object) => Element<any>,
    currentProgramId?: string,
    noItemsText?: string,
|}>

const getStyles = (theme: Theme) => ({
    noItemsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
});


const CardListIndex = ({
    classes,
    items,
    getCustomItemBottomElements,
    getCustomItemTopElements,
    dataElements,
    noItemsText,
    currentProgramId,
}: OwnProps & CssClasses) => {
    const { imageDataElement } = makeElementsContainerSelector()(dataElements);

    return (
        <>
            {
                (!items || items.length === 0)
                    ?
                    (<div className={classes.noItemsContainer}>
                        {noItemsText}
                    </div>)
                    :
                    items.map(item => (
                        <CardListItem
                            key={item.id}
                            item={item}
                            currentProgramId={currentProgramId}
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

export const CardList: ComponentType<OwnProps> = withStyles(getStyles)(CardListIndex);
