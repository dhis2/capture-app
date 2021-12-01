// @flow
import i18n from '@dhis2/d2-i18n';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { type ComponentType } from 'react';
import { DataSection } from '../DataSection';
import { CommentSection } from '../WidgetComment';
import { ScheduleButtons } from './ScheduleButtons';
import { ScheduleDate } from './ScheduleDate';
import { ScheduleText } from './ScheduleText';
import type { Props } from './widgetEventSchedule.types';


const styles = () => ({
    wrapper: {
        padding: `${spacers.dp16} 0`,
        maxWidth: '55.75rem',
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: `${spacers.dp8}  ${spacers.dp16}`,
    },
    fieldLabel: {
        color: colors.grey900,
        flexGrow: 0,
        flexShrink: 0,
        paddingTop: spacersNum.dp16,
        paddingRight: spacersNum.dp16,
    },
    fieldContent: {
        flexGrow: 1,
        flexShrink: 0,
    },
});

const WidgetEventSchedulePlain = ({
    stageId, programId, programName, stageName, orgUnit, onSchedule, onAddComment, classes, ...passOnProps
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
        <DataSection
            dataTest="comment-section"
            sectionName={i18n.t('Event comments')}
        >
            <CommentSection
                comments={[]}
                placeholder={i18n.t('Write a comment about this scheduled event')}
                handleAddComment={onAddComment}
            />
        </DataSection>
        <ScheduleButtons onCancel={() => {}} onSchedule={onSchedule} />
        <ScheduleText
            programName={programName}
            stageName={stageName}
            orgUnitName={orgUnit?.name || ''}
        />
    </div>
);

export const WidgetEventScheduleComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEventSchedulePlain);
