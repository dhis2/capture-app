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
import { availableCardListButtonState, enrollmentTypes } from './CardList.constants';
import { ListEntry } from './ListEntry.component';
import { dataElementTypes } from '../../metaData';

type OwnProps = $ReadOnly<{|
    item: SearchResultItem,
    currentSearchScopeName?: string,
    currentProgramId?: string,
    getCustomTopElements?: ?(props: Object) => Element<any>,
    getCustomBottomElements?: ?(props: Object) => Element<any>,
    imageDataElement: DataElement,
    dataElements: CardDataElementsInformation,
|}>;

const getStyles = (theme: Theme) => ({
    itemContainer: {
        maxWidth: theme.typography.pxToRem(600),
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
    smallerLetters: {
        fontSize: theme.typography.pxToRem(12),
        color: colors.grey700,
        paddingBottom: theme.typography.pxToRem(8),
    },
    enrolled: {
        display: 'flex',
        justifyContent: 'flex-end',
        color: colors.grey700,
    },
    itemValuesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
    image: {
        width: theme.typography.pxToRem(44),
        height: theme.typography.pxToRem(44),
    },
    imageContainer: {
        marginRight: theme.typography.pxToRem(8),
    },
});

const deriveNavigationButtonState =
  (type): $Keys<typeof availableCardListButtonState> => {
      switch (type) {
      case enrollmentTypes.ACTIVE:
          return availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON;
      case enrollmentTypes.CANCELLED:
      case enrollmentTypes.COMPLETED:
          return availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON;
      default:
          return availableCardListButtonState.DONT_SHOW_BUTTON;
      }
  };


const deriveEnrollmentType =
  (enrollments, currentProgramId): $Keys<typeof enrollmentTypes> => {
      if (!currentProgramId) {
          return enrollmentTypes.DONT_SHOW_TAG;
      }

      const enrollmentsInCurrentProgram = enrollments
          .filter(({ program }) => program === currentProgramId)
          .map(({ status, lastUpdated }) => ({ status, lastUpdated }));


      const { ACTIVE, CANCELLED, COMPLETED, NOT_ENROLLED } = enrollmentTypes;
      if (enrollmentsInCurrentProgram.find(({ status }) => status === ACTIVE)) {
          return ACTIVE;
      } else if (enrollmentsInCurrentProgram.find(({ status }) => status === COMPLETED)) {
          return COMPLETED;
      } else if (enrollmentsInCurrentProgram.find(({ status }) => status === CANCELLED)) {
          return CANCELLED;
      }
      return NOT_ENROLLED;
  };

const deriveEnrollmentOrgUnitAndDate =
  (enrollments, enrollmentType, currentProgramId): {orgUnitName?: string, enrollmentDate?: string} => {
      if (!currentProgramId) {
          return {};
      }

      const { orgUnitName, enrollmentDate } = enrollments
          .filter(({ program }) => program === currentProgramId)
          .filter(({ status }) => status === enrollmentType)
          .sort((a, b) => moment.utc(a.lastUpdated).diff(moment.utc(b.lastUpdated)))[0];

      return { orgUnitName, enrollmentDate };
  };


const CardListItemIndex = ({
    item,
    classes,
    imageDataElement,
    getCustomTopElements,
    getCustomBottomElements,
    dataElements,
    currentProgramId,
    currentSearchScopeName,
}: OwnProps & CssClasses) => {
    const renderImageDataElement = (imageElement: DataElement) => {
        const imageValue = item.values[imageElement.id];
        return (
            <div className={classes.imageContainer}>
                {imageValue && <Avatar src={imageValue.url} alt={imageValue.name} className={classes.image} />}
            </div>
        );
    };
    const enrollments = item.tei ? item.tei.enrollments : [];
    const enrollmentType = deriveEnrollmentType(enrollments, currentProgramId);
    const { orgUnitName, enrollmentDate } = deriveEnrollmentOrgUnitAndDate(enrollments, enrollmentType, currentProgramId);
    return (
        <div data-test="dhis2-capture-card-list-item" className={classes.itemContainer}>
            {getCustomTopElements && getCustomTopElements({ item })}
            <div className={classes.itemDataContainer}>

                <div className={classes.itemValuesContainer}>
                    <Grid container spacing={2}>
                        {
                            imageDataElement &&
                            <Grid item>
                                {renderImageDataElement(imageDataElement)}
                            </Grid>
                        }
                        <Grid item xs={16} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                {
                                    dataElements
                                         // $FlowFixMe[prop-missing] automated comment
                                        .filter(({ type }) => type !== dataElementTypes.IMAGE)
                                        .filter(({ displayInReports }) => displayInReports)
                                        .map(({ id, name, type }) => (
                                            <ListEntry
                                                key={id}
                                                name={name}
                                                value={item.values[id]}
                                                type={type}
                                            />))
                                }
                                {
                                    orgUnitName &&
                                    <ListEntry name={i18n.t('Organisation unit')} value={orgUnitName} />
                                }

                                {
                                    enrollmentDate &&
                                    // $FlowFixMe[prop-missing] automated comment
                                    <ListEntry name={i18n.t('Date of enrollment')} value={enrollmentDate} type={dataElementTypes.DATE} />
                                }

                            </Grid>
                            <Grid item>
                                {
                                    item.tei && item.tei.lastUpdated &&
                                    <div className={classes.smallerLetters}>
                                        { i18n.t('Last updated') } {item.tei && moment(item.tei.lastUpdated).fromNow()}
                                    </div>
                                }

                                <div className={classes.enrolled}>
                                    {
                                        (enrollmentType === enrollmentTypes.ACTIVE) &&
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
                                            {i18n.t('Enrolled')}
                                        </Tag>
                                    }

                                    {
                                        (enrollmentType === enrollmentTypes.CANCELLED ||
                                          enrollmentType === enrollmentTypes.COMPLETED) &&
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
                                              {i18n.t('Previously enrolled')}
                                          </Tag>
                                    }

                                    {
                                        (enrollmentType === enrollmentTypes.NOT_ENROLLED) &&
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
                getCustomBottomElements({
                    item,
                    navigationButtonsState: deriveNavigationButtonState(enrollmentType),
                    programName: currentSearchScopeName,
                })
            }
        </div>
    );
};

export const CardListItem: ComponentType<OwnProps> = withStyles(getStyles)(CardListItemIndex);
