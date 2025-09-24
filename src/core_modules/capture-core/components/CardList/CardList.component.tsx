import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { CardListItem } from './CardListItem.component';
import { makeElementsContainerSelector } from './CardList.selectors';
import { CardDataElementsInformation } from '../SearchBox';
import type { ListItem, RenderCustomCardActions } from './CardList.types';

type OwnProps = {
    dataElements: CardDataElementsInformation;
    items: ListItem[];
    currentProgramId?: string;
    currentSearchScopeName?: string;
    currentSearchScopeType?: string;
    noItemsText?: string;
    renderCustomCardActions?: RenderCustomCardActions;
};

const getStyles = (theme: any) => ({
    noItemsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
});

type Props = OwnProps & WithStyles<typeof getStyles>;

const CardListIndex: React.FC<Props> = (props) => {
    const {
        classes,
        items,
        renderCustomCardActions,
        dataElements,
        noItemsText,
        currentProgramId,
        currentSearchScopeName,
        currentSearchScopeType,
    } = props;

    const { profileImageDataElement, dataElementsExceptProfileImage } = makeElementsContainerSelector()(dataElements as any);
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
                            currentSearchScopeType={currentSearchScopeType}
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

export const CardList = withStyles(getStyles)(CardListIndex);
