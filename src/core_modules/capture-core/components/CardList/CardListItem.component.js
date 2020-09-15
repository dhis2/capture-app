// @flow
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import moment from 'moment';
import type { ComponentType, Element } from 'react';
import { Avatar, Grid, withStyles } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { colors, Tag } from '@dhis2/ui-core';
import type { CardDataElementsInformation, SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';
import type { DataElement } from '../../metaData';
import { availableCardListButtonState, enrollmentStatuses } from './CardList.constants';

type OwnProps = $ReadOnly<{|
    programName: string,
    item: SearchResultItem,
    enrollmentStatus: $Keys<typeof enrollmentStatuses>,
    getCustomTopElements?: ?(props: Object) => Element<any>,
    getCustomBottomElements?: ?(props: Object, availableCardListButtonsState: $Keys<typeof availableCardListButtonState>, programName: string) => Element<any>,
    imageDataElement: DataElement,
    dataElements: CardDataElementsInformation,
|}>;

const selectAvailableButtonState = (status) => {
    switch (status) {
    case enrollmentStatuses.ACTIVE:
        return availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON;
    case enrollmentStatuses.CANCELLED:
    case enrollmentStatuses.COMPLETED:
        return availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON;
    default:
        return availableCardListButtonState.DONT_SHOW_BUTTON;
    }
};

const getStyles = (theme: Theme) => ({
    itemContainer: {
        width: theme.typography.pxToRem(600),
        display: 'flex',
        flexDirection: 'column',
        margin: theme.typography.pxToRem(8),
        padding: theme.typography.pxToRem(8),
        borderRadius: theme.typography.pxToRem(5),
        border: `1px solid ${colors.grey400}`,
        backgroundColor: colors.grey050,
    },
    itemDataContainer: {
        display: 'flex',
    },
    lastUpdated: {
        fontSize: theme.typography.pxToRem(12),
        color: colors.grey700,
        paddingBottom: theme.typography.pxToRem(8),
    },
    enrolled: {
        display: 'flex',
        justifyContent: 'flex-end',
        color: colors.grey700,
    },
    elementName: {
        fontSize: theme.typography.pxToRem(13),
        color: colors.grey700,

    },
    elementValue: {
        fontSize: theme.typography.pxToRem(14),
        color: colors.grey900,
        fontWeight: 500,
    },
    itemValuesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
    value: {
        paddingBottom: theme.typography.pxToRem(4),
    },
    image: {
        width: theme.typography.pxToRem(44),
        height: theme.typography.pxToRem(44),
    },
    imageContainer: {
        marginRight: theme.typography.pxToRem(8),
    },
});

const CardListItemIndex = (props: OwnProps & CssClasses) => {
    const renderImageDataElement = (imageDataElement: DataElement) => {
        const { item, classes } = props;
        const imageValue = item.values[imageDataElement.id];
        return (
            <div className={classes.imageContainer}>
                {imageValue && <Avatar src={imageValue.url} alt={imageValue.name} className={classes.image} />}
            </div>
        );
    };

    const {
        item,
        classes,
        imageDataElement,
        getCustomTopElements,
        getCustomBottomElements,
        enrollmentStatus,
        dataElements,
        programName,
    } = props;

    return (
        <div data-test="dhis2-capture-card-list-item" className={classes.itemContainer}>
            {getCustomTopElements && getCustomTopElements(props)}
            <div className={classes.itemDataContainer}>

                <div className={classes.itemValuesContainer}>
                    <Grid container spacing={2}>
                        {
                            imageDataElement &&
                            <Grid item>
                                {renderImageDataElement(imageDataElement)}
                            </Grid>
                        }
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                {
                                    dataElements.map(element => (
                                        <Grid item xs>
                                            <div key={element.id} className={classes.value}>
                                                <span className={classes.elementName}>
                                                    {element.name}:&nbsp;
                                                </span>
                                                <span className={classes.elementValue}>
                                                    {item.values[element.id]}
                                                </span>
                                            </div>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            <Grid item>
                                {
                                    item.tei && item.tei.lastUpdated &&
                                    <div className={classes.lastUpdated}>
                                        { i18n.t('Last updated') } {item.tei && moment(item.tei.lastUpdated).fromNow()}
                                    </div>
                                }
                                <div className={classes.enrolled}>
                                    {
                                        (enrollmentStatus === enrollmentStatuses.ACTIVE) &&
                                        <Tag
                                            dataTest="dhis2-uicore-tag"
                                            positive
                                            icon={
                                                <DoneIcon
                                                    style={{
                                                        transformBox: 'view-box',
                                                        fontSize: 14,
                                                        position: 'relative',
                                                        top: '-1px',
                                                    }}
                                                />
                                            }
                                        >
                                            {i18n.t('Enrolled: Active')}
                                        </Tag>
                                    }

                                    {
                                        (enrollmentStatus === enrollmentStatuses.CANCELLED) &&
                                        <Tag
                                            dataTest="dhis2-uicore-tag"
                                            neutral
                                        >
                                            {i18n.t('Enrolled: Canceled')}
                                        </Tag>
                                    }

                                    {
                                        (enrollmentStatus === enrollmentStatuses.COMPLETED) &&
                                        <Tag
                                            dataTest="dhis2-uicore-tag"
                                            neutral
                                            icon={
                                                <DoneIcon
                                                    style={{
                                                        transformBox: 'view-box',
                                                        fontSize: 14,
                                                        position: 'relative',
                                                        top: '-1px',
                                                    }}
                                                />
                                            }
                                        >
                                            {i18n.t('Enrolled: Completed')}
                                        </Tag>
                                    }

                                    {
                                        (enrollmentStatus === enrollmentStatuses.NOT_ENROLLED) &&
                                        <Tag dataTest="dhis2-uicore-tag">
                                            {i18n.t('Not enrolled')}
                                        </Tag>
                                    }

                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>

            {
                getCustomBottomElements &&
                getCustomBottomElements(props, selectAvailableButtonState(enrollmentStatus), programName)
            }
        </div>
    );
};

export const CardListItem: ComponentType<OwnProps> = withStyles(getStyles)(CardListItemIndex);
