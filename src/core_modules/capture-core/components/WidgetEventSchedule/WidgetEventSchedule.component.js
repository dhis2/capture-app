// @flow
import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { DataSection } from '../DataSection';
import { ScheduleButtons } from './ScheduleButtons';
import { ScheduleDate } from './ScheduleDate';
import { BottomText, textMode } from '../WidgetEnrollmentEventNew/BottomText';
import type { Props } from './widgetEventSchedule.types';


const styles = () => ({
    wrapper: {
        padding: `${spacersNum.dp16}px 0`,
        maxWidth: '55.75rem',
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: spacersNum.dp8,
    },
    fieldLabel: {
        color: colors.grey900,
        flexGrow: 0,
        flexShrink: 0,
        paddingTop: spacersNum.dp16,
        paddingRight: spacersNum.dp32,
        paddingLeft: spacersNum.dp8,
    },
    fieldContent: {
        flexGrow: 1,
        flexShrink: 0,
    },
});

const WidgetEventSchedulePlain = ({
    stageId, programId, programName, stageName, orgUnit, onSchedule, classes, ...passOnProps
}: Props) => (
    <div className={classes.wrapper}>
        <DataSection
            dataTest="schedule-section"
            sectionName={i18n.t('Schedule info')}
        >
            <div className={classes.fieldWrapper}>
                <div className={classes.fieldLabel}>
                    {i18n.t('Schedule date / Due date', { interpolation: { escapeValue: false } })}
                </div>
                <div className={classes.fieldContent}>
                    <ScheduleDate
                        programId={programId}
                        stageId={stageId}
                        orgUnit={orgUnit}
                        {...passOnProps}
                    />
                </div>
            </div>
        </DataSection>
        <ScheduleButtons onCancel={() => {}} onSchedule={onSchedule} />
        <BottomText
            programName={programName}
            stageName={stageName}
            orgUnitName={orgUnit?.name || ''}
            mode={textMode.SAVE}
        />
    </div>
);

export const WidgetEventScheduleComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEventSchedulePlain);
