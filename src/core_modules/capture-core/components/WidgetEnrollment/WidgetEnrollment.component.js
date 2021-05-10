// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import moment from 'moment';
import {
    IconClock16,
    IconDimensionOrgUnit16,
    IconCalendar16,
    colors,
    Tag,
    spacersNum,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Widget } from '../Widget';
import type { Props } from './enrollment.types';
import { Status } from './Status';
import { convertValue as convertValueServerToClient } from '../../converters/serverToClient';
import { convertValue as convertValueClientToView } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData';

const styles = {
    icon: {
        margin: spacersNum.dp4,
    },
    enrollment: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
    row: {
        margin: `${spacersNum.dp4}px 0`,
    },
    followup: {
        margin: spacersNum.dp4,
    },
};

export const WidgetEnrollmentPlain = ({
    classes,
    enrollment,
    program,
    ownerOrgUnit,
}: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <div data-test="widget-enrollment">
            <Widget
                header={i18n.t('Enrollment')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [
                    setOpenStatus,
                ])}
                open={open}
            >
                <div className={classes.enrollment}>
                    {enrollment.followup && (
                        <div>
                            <Tag className={classes.followup} negative>
                                {i18n.t('Follow-up')}
                            </Tag>
                        </div>
                    )}

                    <div data-test="widget-enrollment-status">
                        <Status status={enrollment.status} />
                    </div>

                    <div
                        className={classes.row}
                        data-test="widget-enrollment-enrollment-date"
                    >
                        <span
                            className={classes.icon}
                            data-test="widget-enrollment-icon-calendar"
                        >
                            <IconCalendar16 color={colors.grey700} />
                        </span>
                        {program.enrollmentDateLabel}{' '}
                        {moment(enrollment.enrollmentDate).format('l')}
                    </div>

                    {program.displayIncidentDate && (
                        <div
                            className={classes.row}
                            data-test="widget-enrollment-incident-date"
                        >
                            <span className={classes.icon}>
                                <IconCalendar16 color={colors.grey700} />
                            </span>
                            {program.incidentDateLabel}{' '}
                            {moment(enrollment.incidentDate).format('l')}
                        </div>
                    )}

                    <div
                        className={classes.row}
                        data-test="widget-enrollment-orgunit"
                    >
                        <span
                            className={classes.icon}
                            data-test="widget-enrollment-icon-orgunit"
                        >
                            <IconDimensionOrgUnit16 color={colors.grey700} />
                        </span>
                        {i18n.t('Started at')} {enrollment.orgUnitName}
                    </div>

                    <div
                        className={classes.row}
                        data-test="widget-enrollment-owner-orgunit"
                    >
                        <span
                            className={classes.icon}
                            data-test="widget-enrollment-icon-owner-orgunit"
                        >
                            <IconDimensionOrgUnit16 color={colors.grey700} />
                        </span>
                        {i18n.t('Owned by')} {ownerOrgUnit.displayName}
                    </div>

                    <div
                        className={classes.row}
                        data-test="widget-enrollment-last-update"
                    >
                        <span
                            className={classes.icon}
                            data-test="widget-enrollment-icon-clock"
                        >
                            <IconClock16 color={colors.grey700} />
                        </span>
                        {i18n.t('Last updated')}{' '}
                        {moment(enrollment.lastUpdated).fromNow()}
                    </div>

                    {enrollment.geometry && (
                        <div className={classes.row}>
                            <>
                                {convertValueClientToView(
                                    convertValueServerToClient(
                                        enrollment.geometry.coordinates,
                                        dataElementTypes.COORDINATE,
                                    ),
                                    dataElementTypes.COORDINATE,
                                )}
                            </>
                        </div>
                    )}
                </div>
            </Widget>
        </div>
    );
};

export const WidgetEnrollment: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(WidgetEnrollmentPlain);
