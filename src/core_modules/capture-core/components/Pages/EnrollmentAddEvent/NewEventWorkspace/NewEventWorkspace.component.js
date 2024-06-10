// @flow
import React, { type ComponentType, useState, useRef, useMemo } from 'react';
import { TabBar, Tab, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { tabMode } from './newEventWorkspace.constants';
import { getProgramAndStageForProgram } from '../../../../metaData';
import { WidgetEnrollmentEventNew } from '../../../WidgetEnrollmentEventNew';
import { DiscardDialog } from '../../../Dialogs/DiscardDialog.component';
import { Widget } from '../../../Widget';
import { WidgetStageHeader } from './WidgetStageHeader';
import { WidgetEventSchedule } from '../../../WidgetEventSchedule';
import { addEnrollmentEventPageDefaultActionTypes } from '../EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.actions';
import type { PlainProps, Props } from './newEventWorkspace.types';
import { useLocationQuery } from '../../../../utils/routing';
import { defaultDialogProps } from '../../../Dialogs/DiscardDialog.constants';

const styles = () => ({
    innerWrapper: {
        padding: `0 ${spacersNum.dp16}px`,
    },
});

const NewEventWorkspacePlain = ({
    stageId,
    programId,
    orgUnitId,
    teiId,
    enrollmentId,
    dataEntryHasChanges,
    onCancel,
    onSave,
    classes,
    ...passOnProps
}: PlainProps) => {
    const { tab } = useLocationQuery();
    const { events, enrolledAt, occurredAt } = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment);
    const [mode, setMode] = useState(tab ?? tabMode.REPORT);
    const [isWarningVisible, setWarningVisible] = useState(false);
    const tempMode = useRef(undefined);
    const { stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);

    const onHandleSwitchTab = (newMode) => {
        if (dataEntryHasChanges) {
            setWarningVisible(true);
            tempMode.current = newMode;
        } else {
            setMode(newMode);
        }
    };

    return (
        <>
            <Widget
                noncollapsible
                header={
                    <WidgetStageHeader stage={stage} />
                }
            >
                <div data-test={'add-event-enrollment-page-content'} className={classes.innerWrapper}>
                    <TabBar dataTest="new-event-tab-bar">
                        <Tab
                            key="report-tab"
                            selected={mode === tabMode.REPORT}
                            onClick={() => onHandleSwitchTab(tabMode.REPORT)}
                            dataTest="new-event-report-tab"
                        >{i18n.t('Report')}</Tab>
                        <Tab
                            key="schedule-tab"
                            selected={mode === tabMode.SCHEDULE}
                            onClick={() => onHandleSwitchTab(tabMode.SCHEDULE)}
                            dataTest="new-event-schedule-tab"
                        >{i18n.t('Schedule')}</Tab>
                        {/* <Tab
                            key="refer-tab"
                            selected={mode === tabMode.REFER}
                            onClick={() => onHandleSwitchTab(tabMode.REFER)}
                            dataTest="new-event-refer-tab"
                        >{i18n.t('Refer')}</Tab> */}
                    </TabBar>
                    {mode === tabMode.REPORT && <WidgetEnrollmentEventNew
                        programId={programId}
                        stageId={stageId}
                        orgUnitId={orgUnitId}
                        teiId={teiId}
                        enrollmentId={enrollmentId}
                        onSaveSuccessActionType={addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_SUCCESS}
                        onSaveErrorActionType={addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ERROR}
                        onSaveAndCompleteEnrollmentSuccessActionType={
                            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS
                        }
                        onSaveAndCompleteEnrollmentErrorActionType={
                            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR
                        }
                        onSave={onSave}
                        onCancel={onCancel}
                        {...passOnProps}
                    />}
                    {mode === tabMode.SCHEDULE && <WidgetEventSchedule
                        programId={programId}
                        stageId={stageId}
                        orgUnitId={orgUnitId}
                        teiId={teiId}
                        eventData={events}
                        enrollmentId={enrollmentId}
                        enrolledAt={enrolledAt}
                        occurredAt={occurredAt}
                        onSaveSuccessActionType={addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_SUCCESS}
                        onSaveErrorActionType={addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_ERROR}
                        onSave={onSave}
                        onCancel={onCancel}
                        hideDueDate={stage?.hideDueDate}
                        enableUserAssignment
                    />}
                </div>
            </Widget>
            <DiscardDialog
                {...defaultDialogProps}
                onDestroy={() => { setMode(tempMode.current); setWarningVisible(false); }}
                open={isWarningVisible}
                onCancel={() => setWarningVisible(false)}
            />
        </>
    );
};

export const NewEventWorkspace: ComponentType<
    Props,
> = withStyles(styles)(NewEventWorkspacePlain);
