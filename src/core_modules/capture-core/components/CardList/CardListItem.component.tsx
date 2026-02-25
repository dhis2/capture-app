import i18n from '@dhis2/d2-i18n';
import React from 'react';
import moment from 'moment';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { colors, Tag, IconCheckmark16, Tooltip } from '@dhis2/ui';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { CardImage } from 'capture-ui/CardImage/CardImage.component';
import {
    type CardDataElementsInformation,
    type CardProfileImageElementInformation,
    searchScopes,
} from '../SearchBox';
import { enrollmentTypes } from './CardList.constants';
import { ListEntry } from './ListEntry.component';
import {
    dataElementTypes,
    getTrackerProgramThrowIfNotFound,
    OptionSet,
    type TrackerProgram,
} from '../../metaData';
import { useOrgUnitNameWithAncestors } from '../../metadataRetrieval/orgUnitName';
import type { ListItem, RenderCustomCardActions } from './CardList.types';

type OwnProps = {
    item: ListItem,
    currentSearchScopeName?: string,
    currentProgramId?: string,
    currentSearchScopeType?: string,
    renderCustomCardActions?: RenderCustomCardActions,
    profileImageDataElement?: CardProfileImageElementInformation,
    dataElements: CardDataElementsInformation,
};

type Props = OwnProps & WithStyles<typeof styles>;

const styles = (theme: any) => ({
    itemContainer: {
        maxWidth: theme.typography.pxToRem(600),
        display: 'flex',
        flexDirection: 'column',
        margin: theme.typography.pxToRem(8),
        marginLeft: theme.typography.pxToRem(12),
        marginRight: 0,
        padding: theme.typography.pxToRem(8),
        borderRadius: theme.typography.pxToRem(5),
        border: `1px solid ${colors.grey400}`,
        backgroundColor: colors.grey050,
        position: 'relative',
    },
    itemDataContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    timestamp: {
        fontSize: theme.typography.pxToRem(12),
        color: colors.grey700,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
    },
    itemValuesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
    image: {
        width: theme.typography.pxToRem(54),
        height: theme.typography.pxToRem(54),
        marginRight: theme.typography.pxToRem(8),
    },
    buttonMargin: {
        marginTop: theme.typography.pxToRem(8),
    },
    checkIcon: {
        position: 'relative',
    },
}) as const;

type Enrollment = { program: string, status: string, lastUpdated: string, orgUnit: string, enrolledAt: string };

const deriveEnrollmentType =
    (enrollments: readonly Enrollment[], currentProgramId?: string): keyof typeof enrollmentTypes => {
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

type EnrollmentOrgUnitInfo = { orgUnitId?: string, enrolledAt?: string };

const deriveEnrollmentOrgUnitIdAndDate = (
    enrollments: readonly Enrollment[] | undefined,
    enrollmentType: keyof typeof enrollmentTypes,
    currentProgramId?: string,
): EnrollmentOrgUnitInfo => {
    if (!enrollments?.length) { return {}; }
    if (!currentProgramId && enrollments.length) {
        const { orgUnit: orgUnitId, enrolledAt } = enrollments[0] ?? {};
        return { orgUnitId, enrolledAt };
    }

    const relevantEnrollment = enrollments
        .filter(({ program }) => program === currentProgramId)
        .filter(({ status }) => status === enrollmentType)
        .sort((a, b) => moment.utc(a.lastUpdated).diff(moment.utc(b.lastUpdated)))[0];

    const { orgUnit: orgUnitId, enrolledAt } = relevantEnrollment || {};

    return { orgUnitId, enrolledAt };
};

const deriveProgramFromEnrollment = (
    enrollments: readonly Enrollment[],
    currentSearchScopeType?: string,
): TrackerProgram | undefined => {
    if ((currentSearchScopeType === searchScopes.ALL_PROGRAMS ||
        currentSearchScopeType === searchScopes.PROGRAM) && enrollments?.[0]?.program) {
        const program: TrackerProgram = getTrackerProgramThrowIfNotFound(enrollments[0].program);
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
    const enrollments: readonly Enrollment[] = item.tei?.enrollments ?? [];
    const enrollmentType = deriveEnrollmentType(enrollments, currentProgramId);
    const { orgUnitId, enrolledAt } = deriveEnrollmentOrgUnitIdAndDate(enrollments, enrollmentType, currentProgramId);
    const { displayName: orgUnitName } = useOrgUnitNameWithAncestors(orgUnitId ?? null);
    const program: TrackerProgram | undefined = enrollments.length
        ? deriveProgramFromEnrollment(enrollments, currentSearchScopeType)
        : undefined;
    const { fromServerDate } = useTimeZoneConversion();

    const renderImageDataElement = (imageElement?: CardProfileImageElementInformation): React.ReactNode => {
        if (!imageElement) { return null; }
        const imageValue = item.values[imageElement.id] as { url: string } | undefined;
        return (
            <div>
                {imageValue &&
                    <CardImage
                        dataTest={`list-item-image-${imageElement.id}`}
                        imageUrl={imageValue.url}
                        className={classes.image}
                        size="medium"
                    />
                }
            </div>
        );
    };

    const renderTag = (): React.ReactNode => {
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

    const renderEnrollmentDetails = (): React.ReactNode => {
        if (currentSearchScopeType === searchScopes.ALL_PROGRAMS) {
            return null;
        }

        return (<>
            <ListEntry
                name={i18n.t('Organisation unit')}
                value={orgUnitName}
            />
            <ListEntry
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
                    {renderImageDataElement(profileImageDataElement)}
                    <div>
                        {dataElements
                            .map((dataElement: {
                                id: string,
                                name: string,
                                type: keyof typeof dataElementTypes,
                                optionSet?: OptionSet | null
                            }) => {
                                const { id, name, type, optionSet } = dataElement;
                                return (
                                    <ListEntry
                                        key={id}
                                        name={name}
                                        value={item.values[id] as string | undefined}
                                        type={type}
                                        dataElement={{ optionSet, type } as any}
                                    />
                                );
                            })
                        }
                        {renderEnrollmentDetails()}
                    </div>
                </div>
                <div className={classes.details}>
                    {renderTag()}
                    {item.tei?.updatedAt && (
                        <div className={classes.timestamp}>
                            {i18n.t('Last updated')}{' '}
                            <Tooltip content={fromServerDate(item.tei.updatedAt).toLocaleString()}>
                                {moment(fromServerDate(item.tei.updatedAt)).fromNow()}
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
            {renderCustomCardActions && (
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
            )}
        </div>
    );
};

export const CardListItem =
    withStyles(styles)(CardListItemIndex) as React.ComponentType<OwnProps>;
