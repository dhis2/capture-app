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


const CardListIndex = ({
    classes,
    noItemsText,
    items,
    getCustomItemBottomElements,
    getCustomItemTopElements,
    dataElements,
    currentProgramId,
}: OwnProps & CssClasses) => {
    const { imageDataElement } = makeElementsContainerSelector()(dataElements);

    const deriveEnrollmentStatus = (enrollments = []) => {
        if (!currentProgramId) {
            return enrollmentStatuses.DONT_SHOW_TAG;
        }

        const enrollmentsInCurrentProgram = enrollments
            .filter(({ program }) => program === currentProgramId)
            .map(({ status, lastUpdated }) => ({ status, lastUpdated }));


        const { ACTIVE, CANCELLED, COMPLETED, NOT_ENROLLED } = enrollmentStatuses;
        if (enrollmentsInCurrentProgram.find(({ status }) => status === ACTIVE)) {
            return ACTIVE;
        } else if (enrollmentsInCurrentProgram.find(({ status }) => status === CANCELLED)) {
            return CANCELLED;
        } else if (enrollmentsInCurrentProgram.find(({ status }) => status === COMPLETED)) {
            return COMPLETED;
        }
        return NOT_ENROLLED;
    };

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
                            enrollmentStatus={deriveEnrollmentStatus(item.tei && item.tei.enrollments)}
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
