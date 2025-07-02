import React, { useState, useCallback, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WidgetEnrollmentEventNew } from '../../../WidgetEnrollmentEventNew';
import { WidgetStageHeader } from './WidgetStageHeader';
import { WidgetEventSchedule } from '../../../WidgetEventSchedule';
import { addEnrollmentEventPageDefaultActionTypes } from '../EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.actions';
import type { PlainProps, Props } from './newEventWorkspace.types';
import { useLocationQuery } from '../../../../utils/routing';
import { tabMode } from './newEventWorkspace.constants';

const styles = {
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column' as const,
    },
    tabBarContainer: {
        borderBottom: '1px solid #e0e0e0',
    },
    tabContent: {
        flexGrow: 1,
        padding: '16px',
    },
};

const NewEventWorkspacePlain = ({
    programId,
    stageId,
    orgUnitId,
    teiId,
    enrollmentId,
    dataEntryHasChanges,
    widgetReducerName,
    rulesExecutionDependencies,
    onSave,
    onCancel,
    classes,
    ...passOnProps
}: PlainProps) => {
    const { tab } = useLocationQuery();
    const [mode, setMode] = useState(tab ?? tabMode.REPORT);

    const handleTabChange = useCallback((selectedTab: string) => {
        if (dataEntryHasChanges) {
            return;
        }
        setMode(selectedTab);
    }, [dataEntryHasChanges]);

    const renderTabContent = () => {
        if (mode === tabMode.SCHEDULE) {
            return (
                <WidgetEventSchedule
                    programId={programId}
                    stageId={stageId}
                    orgUnitId={orgUnitId}
                    teiId={teiId}
                    enrollmentId={enrollmentId}
                    onSave={onSave}
                    onCancel={onCancel}
                    widgetReducerName={widgetReducerName}
                    rulesExecutionDependencies={rulesExecutionDependencies}
                    {...passOnProps}
                />
            );
        }

        return (
            <WidgetEnrollmentEventNew
                programId={programId}
                stageId={stageId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                onSave={onSave}
                onCancel={onCancel}
                widgetReducerName={widgetReducerName}
                rulesExecutionDependencies={rulesExecutionDependencies}
                saveSuccessActionType={addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_SUCCESS}
                saveErrorActionType={addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ERROR}
                {...passOnProps}
            />
        );
    };

    return (
        <div className={classes.container}>
            <WidgetStageHeader stage={{ name: 'Event Stage' }} classes={{}} />
            <div className={classes.tabBarContainer}>
                <div>
                    <button
                        onClick={() => handleTabChange(tabMode.REPORT)}
                        style={{ backgroundColor: mode === tabMode.REPORT ? '#ccc' : 'transparent' }}
                    >
                        Report
                    </button>
                    <button
                        onClick={() => handleTabChange(tabMode.SCHEDULE)}
                        style={{ backgroundColor: mode === tabMode.SCHEDULE ? '#ccc' : 'transparent' }}
                    >
                        Schedule
                    </button>
                </div>
            </div>
            <div className={classes.tabContent}>
                {renderTabContent()}
            </div>
        </div>
    );
};

export const NewEventWorkspace = withStyles(styles)(NewEventWorkspacePlain) as ComponentType<Props>;
