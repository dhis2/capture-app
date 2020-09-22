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
import { enrollmentTypes } from './CardList.constants';
import { ListEntry } from './ListEntry.component';

type OwnProps = $ReadOnly<{|
    item: SearchResultItem,
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
                                    dataElements.map(element => (
                                        <ListEntry key={element.id} name={element.name} value={item.values[element.id]} />
                                    ))
                                }
                                {
                                    orgUnitName &&
                                    <ListEntry name={i18n.t('Organisation unit: ')} value={orgUnitName} />
                                }

                                {
                                    enrollmentDate &&
                                    <ListEntry name={i18n.t('Date of enrollment:')} value={moment(enrollmentDate).format('L')} />
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

            {getCustomBottomElements && getCustomBottomElements({ item })}
        </div>
    );
};

export const CardListItem: ComponentType<OwnProps> = withStyles(getStyles)(CardListItemIndex);
