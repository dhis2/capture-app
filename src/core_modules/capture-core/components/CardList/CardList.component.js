// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { CardListItem } from './CardListItem.component';
import { makeElementsContainerSelector } from './CardList.selectors';
import type { CardDataElementsInformation } from '../Pages/Search/SearchResults/SearchResults.types';
import type { ListItem, RenderCustomCardActions } from './CardList.types';

type OwnProps = $ReadOnly<{|
    dataElements: CardDataElementsInformation,
    items: Array<ListItem>,
    currentProgramId?: string,
    currentSearchScopeName?: string,
    noItemsText?: string,
    renderCustomCardActions?: RenderCustomCardActions,
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
    renderCustomCardActions,
    dataElements,
    noItemsText,
    currentProgramId,
    currentSearchScopeName,
}: OwnProps & CssClasses) => {
    const { profileImageDataElement, dataElementsExceptProfileImage } = makeElementsContainerSelector()(dataElements);
    return (
        <div data-test="search-results-list">
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
                            renderCustomCardActions={renderCustomCardActions}
                            profileImageDataElement={profileImageDataElement}
                            dataElements={dataElementsExceptProfileImage}
                        />
                    ))
            }
        </div>
    );
};

export const CardList: ComponentType<OwnProps> = withStyles(getStyles)(CardListIndex);
