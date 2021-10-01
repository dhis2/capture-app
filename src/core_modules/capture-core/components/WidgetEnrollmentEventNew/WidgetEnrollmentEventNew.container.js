// @flow
import React, { useMemo, useState, useRef, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { TabBar, Tab, spacersNum, colors } from '@dhis2/ui';
import { Widget } from '../Widget';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { AccessVerification } from './AccessVerification';
import type { WidgetProps } from './WidgetEnrollmentEventNew.types';
import { tabMode } from './WidgetEnrollmentEventNew.constants';
import { SwitchTabWarning } from './SwitchTabWarning';
import { NonBundledDhis2Icon } from '../NonBundledDhis2Icon';

const styles = () => ({
    wrapper: {
        background: colors.white,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
});


const WidgetEnrollmentEventNewPlain = ({ programId, stageId, onSave, classes, ...passOnProps }: WidgetProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const [mode, setMode] = useState(tabMode.REPORT);
    const [isWarningVisible, setWarningVisible] = useState(false);
    const tempMode = useRef(undefined);

    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }

    const formFoundation = stage.stageForm;

    const onHandleSwitchTab = (newMode) => {
        setWarningVisible(true);
        tempMode.current = newMode;
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
        <Widget
            noncollapsible
            header={<div className={classes.header}>
                {stage.icon && (
                    <div className={classes.icon}>
                        <NonBundledDhis2Icon
                            name={stage.icon?.name}
                            color={stage.icon?.color}
                            width={30}
                            height={30}
                            cornerRadius={2}
                        />
                    </div>
                )}
                <span>{stage.name}</span>
            </div>
            }
        >
            <TabBar dataTest="new-event-tab-bar">
                {tabs.map(tab => <Tab key={`tab-${tab.label}`} {...tab}>{tab.label}</Tab>)}
            </TabBar>
            {mode === tabMode.REPORT && <AccessVerification
                {...passOnProps}
                stage={stage}
                formFoundation={formFoundation}
                program={program}
                onSaveExternal={onSave}
            />}
            <SwitchTabWarning
                open={isWarningVisible}
                onClose={() => setWarningVisible(false)}
                onContinue={() => {
                    // switch tab now
                    setMode(tempMode.current);
                    setWarningVisible(false);
                    tempMode.current = undefined;
                }}
            />
        </Widget>

    );
};

export const WidgetEnrollmentEventNew: ComponentType<
    $Diff<WidgetProps, CssClasses>,
> = withStyles(styles)(WidgetEnrollmentEventNewPlain);
