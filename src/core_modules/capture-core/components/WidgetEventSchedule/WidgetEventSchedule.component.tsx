import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';
import { DividerHorizontal as Divider } from 'capture-ui';
import i18n from '@dhis2/d2-i18n';
import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import { DataSection } from '../DataSection';
import { Widget } from '../Widget';
import { ScheduleButtons } from './ScheduleButtons';
import { ScheduleDate } from './ScheduleDate';
import { ScheduleText } from './ScheduleText';
import { NoteSection } from '../WidgetNote';
import type { Props } from './widgetEventSchedule.types';
import { CategoryOptions } from './CategoryOptions/CategoryOptions.component';
import { Assignee } from './Assignee';
import { ScheduleOrgUnit } from './ScheduleOrgUnit/ScheduleOrgUnit.component';

const styles = (theme: any) => ({
    wrapper: {
        paddingLeft: spacersNum.dp16,
        minWidth: '300px',
    },
    evenNumbersRecords: {
        backgroundColor: theme.palette.grey.lightest,
    },
    divider: {
        backgroundColor: theme.palette.dividerForm,
    },
});

type WidgetEventSchedulePlainProps = Props;

const WidgetEventSchedulePlain = ({
    stageId,
    programId,
    programName,
    stageName,
    displayDueDateLabel,
    orgUnit,
    onCancel,
    onSchedule,
    onAddNote,
    classes,
    scheduleDate,
    suggestedScheduleDate,
    setScheduledOrgUnit,
    serverSuggestedScheduleDate,
    setIsFormValid,
    notes,
    programCategory,
    enableUserAssignment,
    selectedCategories,
    onClickCategoryOption,
    onResetCategoryOption,
    onSetAssignee,
    assignee,
    categoryOptionsError,
    validation,
    setValidation,
    ...passOnProps
}: WidgetEventSchedulePlainProps) => {
    const onSelectOrgUnit = (e: { id: string, displayName: string, path: string }) => {
        setScheduledOrgUnit({
            id: e.id,
            name: e.displayName,
            path: e.path,
        });
    };

    const onDeselectOrgUnit = () => {
        setScheduledOrgUnit(undefined);
    };

    React.useEffect(() => {
        const formIsValid = () => Boolean(isValidOrgUnit(orgUnit as any) && scheduleDate && !validation?.error);
        setIsFormValid(formIsValid());
    }, [orgUnit, scheduleDate, validation, setIsFormValid]);

    return (
        <Widget
            noncollapsible
            borderless
        >
            <div className={classes.wrapper}>
                <DataSection
                    dataTest="schedule-section"
                    sectionName={i18n.t('Schedule info')}
                >
                    <ScheduleDate
                        programId={programId}
                        stageId={stageId}
                        orgUnit={orgUnit}
                        scheduleDate={scheduleDate}
                        displayDueDateLabel={displayDueDateLabel}
                        serverSuggestedScheduleDate={serverSuggestedScheduleDate}
                        validation={validation}
                        setValidation={setValidation}
                        {...passOnProps}
                    />
                    <Divider className={classes.divider} />
                    <div className={classes.evenNumbersRecords}>
                        <ScheduleOrgUnit
                            orgUnit={orgUnit}
                            onSelectOrgUnit={onSelectOrgUnit}
                            onDeselectOrgUnit={onDeselectOrgUnit}
                            {...passOnProps}
                        />
                    </div>
                </DataSection>
                {programCategory && <DataSection
                    dataTest="category-options-section"
                    sectionName={programCategory.displayName}
                >
                    <CategoryOptions
                        categories={programCategory.categories}
                        selectedOrgUnitId={orgUnit?.id}
                        selectedCategories={selectedCategories}
                        categoryOptionsError={categoryOptionsError}
                        onClickCategoryOption={onClickCategoryOption}
                        onResetCategoryOption={onResetCategoryOption}
                        required
                    />
                </DataSection>}
                <DataSection
                    dataTest="note-section"
                    sectionName={i18n.t('Event notes')}
                >
                    <NoteSection
                        notes={notes}
                        placeholder={i18n.t('Write a note about this scheduled event')}
                        handleAddNote={onAddNote}
                        emptyNoteMessage={i18n.t('No notes added yet')}
                    />
                </DataSection>
                {enableUserAssignment && (
                    <DataSection dataTest="assignee-section" sectionName={i18n.t('Assignee')}>
                        <Assignee onSet={onSetAssignee} assignee={assignee} />
                    </DataSection>
                )}
                <ScheduleButtons
                    hasChanges={scheduleDate !== suggestedScheduleDate}
                    onCancel={onCancel}
                    onSchedule={onSchedule}
                    validation={validation}
                />
                <ScheduleText
                    programName={programName}
                    stageName={stageName}
                    orgUnitName={orgUnit?.name}
                />
            </div>
        </Widget>
    );
};

export const WidgetEventScheduleComponent = withStyles(styles)(WidgetEventSchedulePlain) as ComponentType<Omit<Props, 'classes'>>;
