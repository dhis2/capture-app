// @flow
import React from 'react';
import type { ComponentType, Element } from 'react';
import { withStyles } from '@material-ui/core';
import compareAsc from 'date-fns/compare_asc';
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
    currentProgramId?: string,
|}>

const getStyles = (theme: Theme) => ({
    noItemsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
});

const takeLastUpdatedEntry = statuses => statuses
    .sort((a, b) => compareAsc(a.lastUpdated, b.lastUpdated))
    .reverse()[0];

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
        } else if (
            // in case a TEI has at the same time a COMPLETED and a CANCELLED enrollment then
            // we only want to show to the user the one that has been updated latest.
            statuses.find(({ status: statusOne }) => statusOne === CANCELLED &&
            statuses.find(({ status: statusTwo }) => statusTwo === COMPLETED))
        ) {
            const { status } = takeLastUpdatedEntry(statuses);
            return status;
        } else if (statuses.find(({ status }) => status === CANCELLED)) {
            return CANCELLED;
        } else if (statuses.find(({ status }) => status === COMPLETED)) {
            return COMPLETED;
        }
        return NOT_ENROLLED;
    };

    const { imageDataElement } = makeDataElementsContainerSelector()(dataElements);

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
