// @flow
import React, { type ComponentType, useState, useRef, useMemo } from 'react';
import { TabBar, Tab, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { tabMode } from './newEventWorkspace.constants';
import { getProgramAndStageForProgram } from '../../../../metaData';
import { WidgetEnrollmentEventNew } from '../../../WidgetEnrollmentEventNew';
import { ConfirmDialog } from '../../../Dialogs/ConfirmDialog.component';
import { Widget } from '../../../Widget';
import { WidgetStageHeader } from './WidgetStageHeader';
import type { Props } from './newEventWorkspace.types';


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
    classes,
    ...passOnProps
}: Props) => {
    const selectedTab = useSelector(({ router: { location } }) => location.query.tab);
    const [mode, setMode] = useState(selectedTab ?? tabMode.REPORT);
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
                    <WidgetStageHeader stage={stage} />
                }
            >
                <div className={classes.innerWrapper}>
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
                </div>
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
