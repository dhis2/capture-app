// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import moment from 'moment-timezone';
import {
    IconClock16,
    IconDimensionOrgUnit16,
    IconCalendar16,
    IconLocation16,
    colors,
    Tag,
    spacersNum,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { Widget } from '../Widget';
import type { PlainProps } from './enrollment.types';
import { Status } from './Status';
import { convertValue as convertValueServerToClient } from '../../converters/serverToClient';
import { convertValue as convertValueClientToView } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData';
import { Actions } from './Actions';

const styles = {
    icon: {
        margin: `0 ${spacersNum.dp4}px`,
    },
    enrollment: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
    row: {
        display: 'flex',
        margin: `${spacersNum.dp4}px 0`,
    },
    followup: {
        margin: spacersNum.dp4,
    },
};

const getGeometryType = geometryType =>
    (geometryType === 'Point' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON);
const getEnrollmentDateLabel = program => program.enrollmentDateLabel || i18n.t('Enrollment date');
const getIncidentDateLabel = program => program.incidentDateLabel || i18n.t('Incident date');
const getLastUpdatedAt = (serverTimeZoneId, enrollment) => (
    i18n.t('Last updated {{date}}', {
        date: serverTimeZoneId
            ? moment.tz(enrollment.updatedAt, serverTimeZoneId).fromNow()
            : moment(enrollment.updatedAt).fromNow(),
    }));

export const WidgetEnrollmentPlain = ({
    classes,
    enrollment = {},
    program = {},
    ownerOrgUnit = {},
    refetchEnrollment,
    refetchTEI,
    error,
    loading,
    canAddNew,
    onDelete,
    onAddNew,
    onError,
    serverTimeZoneId,
}: PlainProps) => {
    const [open, setOpenStatus] = useState(true);
    const geometryType = getGeometryType(enrollment?.geometry?.type);

    return (
        <div data-test="widget-enrollment">
            <Widget
                header={i18n.t('Enrollment')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {error && (
                    <div className={classes.enrollment}>
                        {i18n.t('Enrollment widget could not be loaded. Please try again later')}
                    </div>
                )}
                {loading && <LoadingMaskElementCenter />}
                {!error && !loading && (
                    <div className={classes.enrollment}>
                        <div data-test="widget-enrollment-status">
                            {enrollment.followUp && (
                                <Tag className={classes.followup} negative>
                                    {i18n.t('Follow-up')}
                                </Tag>
                            )}
                            <Status status={enrollment.status} />
                        </div>

                        <div className={classes.row} data-test="widget-enrollment-enrollment-date">
                            <span className={classes.icon} data-test="widget-enrollment-icon-calendar">
                                <IconCalendar16 color={colors.grey700} />
                            </span>
                            {getEnrollmentDateLabel(program)}{' '}
                            {convertValueClientToView(
                                convertValueServerToClient(enrollment.enrolledAt, dataElementTypes.DATE),
                                dataElementTypes.DATE,
                            )}
                        </div>

                        {program.displayIncidentDate && (
                            <div className={classes.row} data-test="widget-enrollment-incident-date">
                                <span className={classes.icon}>
                                    <IconCalendar16 color={colors.grey700} />
                                </span>
                                {getIncidentDateLabel(program)}{' '}
                                {convertValueClientToView(
                                    convertValueServerToClient(enrollment.occurredAt, dataElementTypes.DATE),
                                    dataElementTypes.DATE,
                                )}
                            </div>
                        )}

                        <div className={classes.row} data-test="widget-enrollment-orgunit">
                            <span className={classes.icon} data-test="widget-enrollment-icon-orgunit">
                                <IconDimensionOrgUnit16 color={colors.grey700} />
                            </span>
                            {i18n.t('Started at {{orgUnitName}}', {
                                orgUnitName: enrollment.orgUnitName,
                                interpolation: { escapeValue: false },
                            })}
                        </div>

                        <div className={classes.row} data-test="widget-enrollment-owner-orgunit">
                            <span className={classes.icon} data-test="widget-enrollment-icon-owner-orgunit">
                                <IconDimensionOrgUnit16 color={colors.grey700} />
                            </span>
                            {i18n.t('Owned by {{ownerOrgUnit}}', {
                                ownerOrgUnit: ownerOrgUnit.displayName,
                            })}
                        </div>

                        <div className={classes.row} data-test="widget-enrollment-last-update">
                            <span className={classes.icon} data-test="widget-enrollment-icon-clock">
                                <IconClock16 color={colors.grey700} />
                            </span>
                            {getLastUpdatedAt(serverTimeZoneId, enrollment)}
                        </div>

                        {enrollment.geometry && (
                            <div className={classes.row}>
                                <span className={classes.icon} data-test="widget-enrollment-icon-clock">
                                    <IconLocation16 color={colors.grey700} />
                                </span>
                                {convertValueClientToView(
                                    convertValueServerToClient(enrollment.geometry.coordinates, geometryType),
                                    geometryType,
                                )}
                            </div>
                        )}
                        <Actions
                            tetName={program.trackedEntityType.displayName}
                            onlyEnrollOnce={program.onlyEnrollOnce}
                            enrollment={enrollment}
                            refetchEnrollment={refetchEnrollment}
                            refetchTEI={refetchTEI}
                            onDelete={onDelete}
                            onAddNew={onAddNew}
                            canAddNew={canAddNew}
                            onError={onError}
                        />
                    </div>
                )}
            </Widget>
        </div>
    );
};

export const WidgetEnrollment: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(WidgetEnrollmentPlain);
