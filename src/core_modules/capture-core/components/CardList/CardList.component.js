// @flow
import React from 'react';
import type { ComponentType, Element } from 'react';
import { withStyles } from '@material-ui/core';
import { CardListItem } from './CardListItem.component';
import makeDataElementsContainerSelector from './CardList.selectors';
import type { SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';
import type { CardDataElementsInformation } from '../Pages/Search/SearchResults/SearchResults.component';
import { enrollmentStatuses } from './CardList.constants';

type OwnProps = $ReadOnly<{|
    dataElements: CardDataElementsInformation,
    items: Array<SearchResultItem>,
    noItemsText?: string,
    itemsLoading?: ?boolean,
    getCustomItemTopElements?: ?(itemProps: Object) => Element<any>,
    getCustomItemBottomElements?: ?(itemProps: Object) => Element<any>,
    currentProgramId: string,
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
        currentProgramId,
    } = props;

    if (!items || items.length === 0) {
        return (
            <div className={classes.noItemsContainer}>
                {noItemsText}
            </div>
        );
    }

    const enrollmentStatus = (enrollments = []) => {
        const statuses = enrollments.filter(({ program }) => program === currentProgramId).map(({ status }) => status);

        if (statuses.find(status => status === enrollmentStatuses.ACTIVE)) {
            return enrollmentStatuses.ACTIVE;
        }
        if (statuses.find(status => status === enrollmentStatuses.CANCELLED)) {
            return enrollmentStatuses.CANCELLED;
        }
        if (statuses.find(status => status === enrollmentStatuses.COMPLETED)) {
            return enrollmentStatuses.COMPLETED;
        }
        return enrollmentStatuses.NOT_ENROLLED;
    };

    const { imageDataElement } = makeDataElementsContainerSelector()(dataElements);

    return (
        <>
            {
                items.map(item => (
                    <CardListItem
                        enrollmentStatus={enrollmentStatus(item.tei && item.tei.enrollments)}
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
