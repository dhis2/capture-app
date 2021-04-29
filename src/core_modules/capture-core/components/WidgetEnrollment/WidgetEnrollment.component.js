// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import moment from 'moment';
import { IconClock16, IconDimensionOrgUnit16, IconCalendar16, colors, Tag, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Widget } from '../Widget';
import type { Props } from './enrollment.types';
import { Status } from './Status';
// import { convertValue } from '../../converters/serverToClient';
// import { convertValue } from '../../converters/clientToList';
// import { dataElementTypes } from '../../metaData';

const styles = {
    icon: {
        color: colors.grey700,
        margin: spacersNum.dp4,
    },
    enrollment: {
        padding: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px ${spacersNum.dp16}px`,
    },
    followup: {
        margin: spacersNum.dp4,
    },
};

export const WidgetEnrollmentPlain = ({ classes, enrollment, program, ownerOrgUnit }: Props) => {
    const [open, setOpenStatus] = useState(true);
    // console.log(enrollment.geometry);
    // console.log(convertValue(enrollment.geometry.coordinates, dataElementTypes.COORDINATE));
    // o.type = featureType === 'POINT' ? dataElementTypes.COORDINATE : dataElementTypes.POLYGON;
    return (
        <div data-test="enrollment-widget">
            <Widget
                header={i18n.t('Enrollment')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
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

                    <div>
                        <Status status={enrollment.status} />
                        {i18n.t('at')}
                        <span className={classes.icon}>
                            <IconDimensionOrgUnit16 />
                        </span>
                        {enrollment.orgUnitName}
                    </div>

                    <div>
                        <span className={classes.icon} data-test="enrollment-widget-icon-calendar">
                            <IconCalendar16 />
                        </span>
                        {program.enrollmentDateLabel} {moment(enrollment.enrollmentDate).format('l')}
                    </div>

                    {program.displayIncidentDate && (
                        <div>
                            <span className={classes.icon}>
                                <IconCalendar16 />
                            </span>
                            {program.incidentDateLabel} {moment(enrollment.incidentDate).format('l')}
                        </div>
                    )}

                    <div>
                        <span className={classes.icon} data-test="enrollment-widget-icon-orgunit">
                            <IconDimensionOrgUnit16 />
                        </span>
                        {i18n.t('Enrolled at')} {ownerOrgUnit.displayName}
                    </div>

                    <div>
                        <span className={classes.icon} data-test="enrollment-widget-icon-clock">
                            <IconClock16 />
                        </span>
                        {i18n.t('Last updated')} {moment(enrollment.lastUpdated).fromNow()}
                    </div>

                    {enrollment.geometry && <div> location TODO</div>}
                </div>
            </Widget>
        </div>
    );
};

export const WidgetEnrollment: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEnrollmentPlain);
