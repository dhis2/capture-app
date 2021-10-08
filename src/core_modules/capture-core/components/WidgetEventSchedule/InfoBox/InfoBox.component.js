// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { IconInfo24, spacersNum, colors } from '@dhis2/ui';
import moment from 'moment';
import type { Props } from './infoBox.types';

const styles = {
    infoBox: {
        maxWidth: '40.75rem',
        display: 'flex',
        borderRadius: 3,
        border: `1px solid ${colors.blue200}`,
        backgroundColor: colors.blue050,
        marginTop: spacersNum.dp16,
        padding: spacersNum.dp16,
    },
    textBox: {
        paddingLeft: spacersNum.dp16,
        color: colors.grey900,
    },
    textBold: {
        fontWeight: 500,
        paddingBottom: spacersNum.dp16,
    },
    textLine: {
        lineHeight: '20px',
    },
};

const InfoBoxPlain = ({ scheduleDate, suggestedScheduleDate, eventCountInOrgUnit, orgUnitName, classes }: Props) => {
    if (!scheduleDate || !suggestedScheduleDate) { return null; }
    const differenceScheduleDateAndSuggestedDate = moment(scheduleDate).diff(moment(suggestedScheduleDate), 'days');

    return (
        <div className={classes.infoBox}>
            <div className={classes.icon}>
                <IconInfo24 />
            </div>
            <div className={classes.textBox}>
                <div className={classes.textBold}>{i18n.t('Schedule date info')}</div>
                <div className={classes.textLine}>{scheduleDate === suggestedScheduleDate ?
                    i18n.t(`This date is the the auto-suggested date based on the intervals defined, 
                    it can be adjusted if needed.`)
                    :
                    i18n.t('This date is {{difference}} days {{position}} the auto-suggested date.',
                        {
                            position: differenceScheduleDateAndSuggestedDate > 0 ? 'after' : 'before',
                            difference: Math.abs(differenceScheduleDateAndSuggestedDate),
                        })
                }
                </div>
                <div className={classes.textLine}>
                    {i18n.t('There are {{eventCountInOrgUnit}} scheduled events in {{orgUnitName}} on this day.', {
                        eventCountInOrgUnit,
                        orgUnitName,
                        interpolation: {
                            escape: false,
                        },
                    })}
                </div>
            </div>
        </div>
    );
};

export const InfoBox: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(InfoBoxPlain));
