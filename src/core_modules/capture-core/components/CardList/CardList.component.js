// @flow
import React from 'react';
import type { ComponentType, Element } from 'react';
import { withStyles } from '@material-ui/core';
import { CardListItem } from './CardListItem.component';
import { makeElementsContainerSelector } from './CardList.selectors';
import type { CardDataElementsInformation, SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';
import { enrollmentStatuses } from './CardList.constants';

type OwnProps = $ReadOnly<{|
    dataElements: CardDataElementsInformation,
    items: Array<SearchResultItem>,
    noItemsText?: string,
    itemsLoading?: ?boolean,
    getCustomItemTopElements?: ?(itemProps: Object) => Element<any>,
    getCustomItemBottomElements?: ?(itemProps: Object) => Element<any>,
    currentProgramId?: string,
|}>

const getStyles = (theme: Theme) => ({
    noItemsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
});

const CardListIndex = (props: OwnProps & CssClasses) => {
    const {
        classes,
        noItemsText,
        items,
        getCustomItemBottomElements,
        getCustomItemTopElements,
        dataElements,
        currentProgramId,
    } = props;

    const isShowingEnrollmentStatus = Boolean(currentProgramId);

    if (!items || items.length === 0) {
        return (
            <div className={classes.noItemsContainer}>
                {noItemsText}
            </div>
        );
    }

    const deriveEnrollmentStatus = (enrollments = []) => {
        if (!isShowingEnrollmentStatus) {
            return enrollmentStatuses.DONT_SHOW_TAG;
        }
        const statuses = enrollments
            .filter(({ program }) => program === currentProgramId)
            .map(({ status, lastUpdated }) => ({ status, lastUpdated }));

        const { ACTIVE, CANCELLED, COMPLETED, NOT_ENROLLED } = enrollmentStatuses;

        if (statuses.find(({ status }) => status === ACTIVE)) {
            return ACTIVE;
        } else if (statuses.find(({ status }) => status === CANCELLED)) {
            return CANCELLED;
        } else if (statuses.find(({ status }) => status === COMPLETED)) {
            return COMPLETED;
        }
        return NOT_ENROLLED;
    };

    const { imageDataElement } = makeElementsContainerSelector()(dataElements);

    return (
        <>
            {
                items.map(item => (
                    <CardListItem
                        enrollmentStatus={deriveEnrollmentStatus(item.tei && item.tei.enrollments)}
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

export const CardList: ComponentType<OwnProps> = withStyles(getStyles)(CardListIndex);
