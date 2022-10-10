// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { IconInfo24, spacersNum, colors } from '@dhis2/ui';
import moment from 'moment';
import type { Props } from './infoBox.types';

const styles = {
    infoBox: {
        maxWidth: '41.25rem',
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

const InfoBoxPlain = ({
    scheduleDate,
    suggestedScheduleDate,
    hideDueDate,
    eventCountInOrgUnit,
    orgUnitName,
    classes,
}: Props) => {
    if (!scheduleDate || !suggestedScheduleDate) { return null; }
    const differenceScheduleDateAndSuggestedDate = moment(scheduleDate).diff(moment(suggestedScheduleDate), 'days');

    return (
        <div className={classes.infoBox}>
            <div className={classes.icon}>
                <IconInfo24 />
            </div>
            <div className={classes.textBox}>
                <div className={classes.textBold}>{i18n.t('Schedule date info')}</div>
                {hideDueDate ? <div className={classes.textLine}>
                    {i18n.t('Scheduled automatically for {{suggestedScheduleDate}}', { suggestedScheduleDate })}
                </div> : <>
                    <div className={classes.textLine}>{scheduleDate === suggestedScheduleDate ?
                        i18n.t(`This date is the suggested scheduled date based on the intervals defined, 
                    it can be adjusted if needed.`)
                        :
                        i18n.t(
                            'This date is {{count}} days {{position}} the suggested date.',
                            {
                                position: differenceScheduleDateAndSuggestedDate > 0 ? i18n.t('after') : i18n.t('before'),
                                count: Math.abs(differenceScheduleDateAndSuggestedDate),
                                defaultValue: 'This date is {{count}} day {{position}} the suggested date.',
                                defaultValue_plural: 'This date is {{count}} days {{position}} the suggested date.',
                            })

                    }
                    </div>
                    <div className={classes.textLine}>
                        {i18n.t('There are {{count}} scheduled event in {{orgUnitName}} on this day.', {
                            count: eventCountInOrgUnit,
                            orgUnitName,
                            defaultValue: 'There are {{count}} scheduled event in {{orgUnitName}} on this day.',
                            defaultValue_plural: 'There are {{count}} scheduled events in {{orgUnitName}} on this day.',
                            interpolation: {
                                escape: false,
                            },
                        })}
                    </div>
                </>}
            </div>
        </div>
    );
};

export const InfoBox: ComponentType<$Diff<Props, CssClasses>> = (withStyles(styles)(InfoBoxPlain));
