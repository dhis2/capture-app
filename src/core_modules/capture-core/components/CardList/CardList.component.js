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
    currentProgramId?: string,
    currentSearchScopeName?: string,
    noItemsText?: string,
    getCustomItemBottomElements?: (itemProps: Object) => Element<any>,
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
    dataElements,
    noItemsText,
    currentProgramId,
    currentSearchScopeName,
}: OwnProps & CssClasses) => {
    const { profileImageDataElement, dataElementsExceptProfileImage } = makeElementsContainerSelector()(dataElements);
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
                            currentSearchScopeName={currentSearchScopeName}
                            currentProgramId={currentProgramId}
                            getCustomBottomElements={getCustomItemBottomElements}
                            profileImageDataElement={profileImageDataElement}
                            dataElements={dataElementsExceptProfileImage}
                        />
                    ))
            }
        </>
    );
};

export const CardList: ComponentType<OwnProps> = withStyles(getStyles)(CardListIndex);
