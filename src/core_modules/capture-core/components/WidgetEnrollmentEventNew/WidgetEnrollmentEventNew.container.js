// @flow
import React, { useMemo, useState, useRef } from 'react';
import i18n from '@dhis2/d2-i18n';
import { TabBar, Tab } from '@dhis2/ui';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { AccessVerification } from './AccessVerification';
import type { WidgetProps } from './WidgetEnrollmentEventNew.types';
import { tabMode } from './WidgetEnrollmentEventNew.constants';
import { SwitchTabWarning } from './SwitchTabWarning';


export const WidgetEnrollmentEventNew = ({ programId, stageId, onSave, ...passOnProps }: WidgetProps) => {
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
    }, {
        label: 'Schedule',
        selected: mode === tabMode.SCHEDULE,
        onClick: () => onHandleSwitchTab(tabMode.SCHEDULE),
    }];

    return (
        <>
            <TabBar>
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
        </>
    );
};
