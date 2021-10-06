// @flow
import React, { useMemo, type ComponentType, useState, useRef } from 'react';
import { TabBar, Tab, spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { tabMode } from './newEventWorkspace.constants';
import { WidgetEnrollmentEventNew } from '../../../WidgetEnrollmentEventNew';
import { ConfirmDialog } from '../../../Dialogs/ConfirmDialog.component';
import { Widget } from '../../../Widget';
import { WidgetStageHeader } from '../../../WidgetStageHeader';
import type { Props } from './newEventWorkspace.types';


const styles = () => ({});

const NewEventWorkspacePlain = ({
    stageId,
    programId,
    orgUnitId,
    teiId,
    enrollmentId,
    dataEntryHasChanges,
    ...passOnProps
}: Props) => {
    const [mode, setMode] = useState(tabMode.REPORT);
    const [isWarningVisible, setWarningVisible] = useState(false);
    const tempMode = useRef(undefined);

    const onHandleSwitchTab = (newMode) => {
        if (dataEntryHasChanges) {
            setWarningVisible(true);
            tempMode.current = newMode;
        } else {
            setMode(newMode);
        }
    };
    const tabs = [{
        label: 'Report',
        selected: mode === tabMode.REPORT,
        onClick: () => onHandleSwitchTab(tabMode.REPORT),
        dataTest: 'new-event-report-tab',
        key: 'report-tab',
    }, {
        label: 'Schedule',
        selected: mode === tabMode.SCHEDULE,
        onClick: () => onHandleSwitchTab(tabMode.SCHEDULE),
        dataTest: 'new-event-schedule-tab',
        key: 'schedule-tab',
    }];
    return (
        <>
            <Widget
                noncollapsible
                header={
                    <WidgetStageHeader stageId={stageId} programId={programId} />
                }
            >
                <TabBar dataTest="new-event-tab-bar">
                    {tabs.map(tab => <Tab key={`tab-${tab.label}`} {...tab}>{tab.label}</Tab>)}
                </TabBar>
                {mode === tabMode.REPORT && <WidgetEnrollmentEventNew
                    programId={programId}
                    stageId={stageId}
                    orgUnitId={orgUnitId}
                    teiId={teiId}
                    enrollmentId={enrollmentId}
                    {...passOnProps}
                />}
            </Widget>
            <ConfirmDialog
                header={i18n.t('Unsaved changes')}
                text={i18n.t('Leaving this page will discard the changes you made to this event.')}
                confirmText={i18n.t('Yes, discard')}
                cancelText={i18n.t('No, stay here')}
                onConfirm={() => { setMode(tempMode.current); setWarningVisible(false); }}
                open={isWarningVisible}
                onCancel={() => setWarningVisible(false)}
            />
        </>
    );
};

export const NewEventWorkspace: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(NewEventWorkspacePlain);
// Adding memo because the lifecycle method in Validated.container grabs the entire state object.
