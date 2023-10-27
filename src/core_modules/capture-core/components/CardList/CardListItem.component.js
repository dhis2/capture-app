// @flow
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import moment from 'moment';
import type { ComponentType } from 'react';
import { Avatar, Grid, withStyles } from '@material-ui/core';
import { colors, Tag, IconCheckmark16 } from '@dhis2/ui';
import type {
    CardDataElementsInformation,
    CardProfileImageElementInformation,
} from '../SearchBox';
import { searchScopes } from '../SearchBox';
import { enrollmentTypes } from './CardList.constants';
import { ListEntry } from './ListEntry.component';
import { dataElementTypes, getTrackerProgramThrowIfNotFound } from '../../metaData';
import { useOrgUnitName } from '../../metadataRetrieval/orgUnitName';
import type { ListItem, RenderCustomCardActions } from './CardList.types';


type OwnProps = $ReadOnly<{|
    item: ListItem,
    currentSearchScopeName?: string,
    currentProgramId?: string,
    currentSearchScopeType?: string,
    renderCustomCardActions?: RenderCustomCardActions,
    profileImageDataElement: ?CardProfileImageElementInformation,
    dataElements: CardDataElementsInformation,
|}>;

type Props = $ReadOnly<{|
    ...OwnProps,
    ...CssClasses
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
        marginRight: theme.typography.pxToRem(8),
    },
    buttonMargin: {
        marginTop: theme.typography.pxToRem(8),
    },
    checkIcon: {
        position: 'relative',
        top: '-2px',
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


      const { ACTIVE, CANCELLED, COMPLETED } = enrollmentTypes;
      if (enrollmentsInCurrentProgram.find(({ status }) => status === ACTIVE)) {
          return ACTIVE;
      } else if (enrollmentsInCurrentProgram.find(({ status }) => status === COMPLETED)) {
          return COMPLETED;
      } else if (enrollmentsInCurrentProgram.find(({ status }) => status === CANCELLED)) {
          return CANCELLED;
      }
      return enrollmentTypes.DONT_SHOW_TAG;
  };

const deriveEnrollmentOrgUnitIdAndDate = (enrollments, enrollmentType, currentProgramId): {orgUnitId?: string, enrolledAt?: string} => {
    if (!enrollments?.length) { return {}; }
    if (!currentProgramId && enrollments.length) {
        const { orgUnit: orgUnitId, enrolledAt } = enrollments[0];

        return {
            orgUnitId,
            enrolledAt,
        };
    }
    const { orgUnit: orgUnitId, enrolledAt } =
        enrollments
            .filter(({ program }) => program === currentProgramId)
            .filter(({ status }) => status === enrollmentType)
            .sort((a, b) => moment.utc(a.lastUpdated).diff(moment.utc(b.lastUpdated)))[0]
        || {};

    return { orgUnitId, enrolledAt };
};

const deriveProgramFromEnrollment = (enrollments, currentSearchScopeType) => {
    if (currentSearchScopeType === searchScopes.ALL_PROGRAMS || currentSearchScopeType === searchScopes.PROGRAM) {
        const program = getTrackerProgramThrowIfNotFound(enrollments[0].program);

        return program;
    }
    return undefined;
};

const CardListItemIndex = ({
    item,
    classes,
    profileImageDataElement,
    renderCustomCardActions,
    dataElements,
    currentProgramId,
    currentSearchScopeName,
    currentSearchScopeType,
}: Props) => {
    const enrollments = item.tei ? item.tei.enrollments : [];
    const enrollmentType = deriveEnrollmentType(enrollments, currentProgramId);
    const { orgUnitId, enrolledAt } = deriveEnrollmentOrgUnitIdAndDate(enrollments, enrollmentType, currentProgramId);
    const { displayName: orgUnitName } = useOrgUnitName(orgUnitId);
    const program = enrollments && enrollments.length
        ? deriveProgramFromEnrollment(enrollments, currentSearchScopeType)
        : undefined;

    const renderImageDataElement = (imageElement?: ?CardProfileImageElementInformation) => {
        if (!imageElement) { return null; }
        const imageValue = item.values[imageElement.id];
        return (
            <div>
                {imageValue && <Avatar src={imageValue.url} alt={imageValue.name} className={classes.image} />}
            </div>
        );
    };

    const renderTag = () => {
        switch (enrollmentType) {
        case enrollmentTypes.ACTIVE:
            return (
                <Tag
                    dataTest="dhis2-uicore-tag"
                    positive
                    icon={
                        <span className={classes.checkIcon}>
                            <IconCheckmark16 />
                        </span>
                    }
                >
                    {i18n.t('Enrolled')}
                </Tag>
            );
        case enrollmentTypes.CANCELLED:
        case enrollmentTypes.COMPLETED:
            return (
                <Tag
                    dataTest="dhis2-uicore-tag"
                    neutral
                    icon={
                        <span className={classes.checkIcon}>
                            <IconCheckmark16 />
                        </span>
                    }
                >
                    {i18n.t('Previously enrolled')}
                </Tag>
            );
        default:
            return null;
        }
    };

    const renderEnrollmentDetails = () => {
        if (currentSearchScopeType === searchScopes.ALL_PROGRAMS) {
            return null;
        }
        return (<>
            <ListEntry
                name={i18n.t('Organisation unit')}
                value={orgUnitName}
            />  <ListEntry
                name={program?.enrollment?.enrollmentDateLabel ?? i18n.t('Date of enrollment')}
                value={enrolledAt}
                type={dataElementTypes.DATE}
            />
        </>);
    };

    return (
        <div data-test="card-list-item" className={classes.itemContainer}>
            <div className={classes.itemDataContainer}>

                <div className={classes.itemValuesContainer}>
                    <Grid container >
                        <Grid item>
                            {renderImageDataElement(profileImageDataElement)}
                        </Grid>
                        <Grid item sm container>
                            <Grid item xs container direction="column" >
                                {dataElements
                                    .map(({ id, name, type }) => (
                                        <ListEntry
                                            key={id}
                                            name={name}
                                            value={item.values[id]}
                                            type={type}
                                        />))
                                }

                                {renderEnrollmentDetails()}
                            </Grid>
                            <Grid item>
                                {
                                    item.tei && item.tei.lastUpdated &&
                                    <div className={classes.smallerLetters}>
                                        { i18n.t('Last updated') } {item.tei && moment(item.tei.lastUpdated).fromNow()}
                                    </div>
                                }

                                <div className={classes.enrolled}>
                                    {renderTag()}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>

            {
                renderCustomCardActions
                &&
                <div className={classes.buttonMargin}>
                    {
                        renderCustomCardActions({
                            item,
                            // we pass the programName because we have the case that the scope of the search
                            // can be different that the scopeId from the url
                            // this can happen for example when you are registering through the relationships
                            programName: currentSearchScopeName,
                            programId: currentProgramId,
                            currentSearchScopeType,
                            enrollmentType,
                        })
                    }
                </div>
            }
        </div>
    );
};

export const CardListItem: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(CardListItemIndex);
