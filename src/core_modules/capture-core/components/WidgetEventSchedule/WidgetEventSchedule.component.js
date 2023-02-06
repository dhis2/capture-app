// @flow
import React, { type ComponentType } from 'react';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { DataSection } from '../DataSection';
import { ScheduleButtons } from './ScheduleButtons';
import { ScheduleDate } from './ScheduleDate';
import { ScheduleText } from './ScheduleText';
import { CommentSection } from '../WidgetComment';
import type { Props } from './widgetEventSchedule.types';
import { CategorySelector } from '../ScopeSelector/QuickSelector/Program/CategorySelector.component';


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
        paddingTop: spacersNum.dp16,
        paddingRight: spacersNum.dp16,
    },
    fieldContent: {
        flexBasis: '200px',
        flexGrow: 1,
    },
    containerWrapper: {
        padding: `${spacers.dp8}  ${spacers.dp16}`,
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    label: {
        flexBasis: 200,
        paddingLeft: 5,
    },
    field: {
        flexBasis: 150,
        flexGrow: 1,
    },
});

const WidgetEventSchedulePlain = ({
    stageId,
    programId,
    programName,
    stageName,
    dueDateLabel,
    orgUnit,
    onCancel,
    onSchedule,
    onAddComment,
    classes,
    scheduleDate,
    suggestedScheduleDate,
    comments,
    categoryCombo,
    onClickCategoryOption,
    ...passOnProps
}: Props) => (
    <div className={classes.wrapper}>
        <DataSection
            dataTest="schedule-section"
            sectionName={i18n.t('Schedule info')}
        >
            <div className={classes.fieldWrapper}>
                <div className={classes.fieldLabel}>
                    {dueDateLabel ?? i18n.t('Schedule date / Due date', { interpolation: { escapeValue: false } })}
                </div>
                <div className={classes.fieldContent}>
                    <ScheduleDate
                        programId={programId}
                        stageId={stageId}
                        orgUnit={orgUnit}
                        scheduleDate={scheduleDate}
                        suggestedScheduleDate={suggestedScheduleDate}
                        {...passOnProps}
                    />
                </div>
            </div>
        </DataSection>
        {categoryCombo && <DataSection
            dataTest="cat-combo-section"
            sectionName={categoryCombo.displayName}
        >
            <div className={classes.containerWrapper}>
                {categoryCombo.categories.map(category => (<div className={classes.container}>
                    <div className={classes.label}>
                        {category.displayName}
                    </div>
                    <div className={classes.field}>
                        <CategorySelector
                            category={category}
                            selectedOrgUnitId={null}
                            onSelect={(option) => { onClickCategoryOption(option, category.id); }}
                        />
                    </div>
                </div>
                ))}
            </div>
        </DataSection>}
        <DataSection
            dataTest="comment-section"
            sectionName={i18n.t('Event comments')}
        >
            <CommentSection
                comments={comments}
                placeholder={i18n.t('Write a comment about this scheduled event')}
                handleAddComment={onAddComment}
            />
        </DataSection>
        <ScheduleButtons
            hasChanges={scheduleDate !== suggestedScheduleDate}
            onCancel={onCancel}
            onSchedule={onSchedule}
        />
        <ScheduleText
            programName={programName}
            stageName={stageName}
            orgUnitName={orgUnit?.name || ''}
        />
    </div>
);

export const WidgetEventScheduleComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEventSchedulePlain);
