import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NoticeBox, spacersNum } from '@dhis2/ui';
import moment from 'moment';
import type { PlainProps } from './InfoBox.types';

const styles = {
    infoBox: {
        marginTop: spacersNum.dp16,
        padding: spacersNum.dp16,
        width: 'fit-content',
    },
};

const getDayDifference = (startDate: string, endDate: string): number =>
    moment(startDate).diff(moment(endDate), 'days');

type Props = PlainProps & WithStyles<typeof styles>;

const InfoBoxPlain = ({
    scheduleDate,
    suggestedScheduleDate,
    hideDueDate,
    eventCountInOrgUnit,
    orgUnitName,
    classes,
}: Props) => {
    if (!scheduleDate || !suggestedScheduleDate) {
        return null;
    }

    const dayDifference = getDayDifference(scheduleDate, suggestedScheduleDate);
    const absoluteDifference = Math.abs(dayDifference);
    const position = dayDifference > 0 ? i18n.t('after') : i18n.t('before');
    const scheduledDateMatchesSuggested = scheduleDate === suggestedScheduleDate;

    return (
        <NoticeBox className={classes.infoBox} title={i18n.t('Schedule date info')}>
            {hideDueDate ? (
                <>
                    {i18n.t('Scheduled automatically for {{suggestedScheduleDate}}', { suggestedScheduleDate })}
                </>
            ) : (
                <>
                    {scheduledDateMatchesSuggested
                        ? i18n.t('The scheduled date matches the suggested date, but can be changed if needed.')
                        : i18n.t(
                            'The scheduled date is {{count}} days {{position}} the suggested date.',
                            {
                                position,
                                count: absoluteDifference,
                                defaultValue: 'The scheduled date is {{count}} day {{position}} the suggested date.',
                                defaultValue_plural: 'The scheduled date is {{count}} days {{position}} the suggested date.',
                            },
                        )
                    }
                    {!!orgUnitName && (
                        <>
                            {' '}
                            {i18n.t('There are {{count}} scheduled event in this program in {{orgUnitName}} on this day.', {
                                count: eventCountInOrgUnit,
                                orgUnitName,
                                defaultValue: 'There are {{count}} scheduled event in this program in {{orgUnitName}} on this day.',
                                defaultValue_plural: 'There are {{count}} scheduled events in this program in {{orgUnitName}} on this day.',
                                interpolation: {
                                    escapeValue: false,
                                },
                            })}
                        </>
                    )}
                </>

            )}
        </NoticeBox>
    );
};

export const InfoBox = withStyles(styles)(InfoBoxPlain) as ComponentType<PlainProps>;
