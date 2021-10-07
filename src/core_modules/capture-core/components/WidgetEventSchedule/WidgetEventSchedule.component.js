// @flow
import React, { type ComponentType, useState, useMemo } from 'react';
import { spacersNum } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { DateField } from 'capture-core/components/FormFields/New';
import { DataSection } from '../DataSection';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { BottomText, textMode } from '../WidgetEnrollmentEventNew/BottomText';
import { useOrganisationUnit } from '../WidgetEnrollmentEventNew/Validated/useOrganisationUnit';
import type { Props } from './widgetEventSchedule.types';


const styles = () => ({
    wrapper: {
        padding: `${spacersNum.dp16}px 0`,
    },
});
const WidgetEventSchedulePlain = ({ stageId, programId, orgUnitId, classes }: Props) => {
    const [scheduleDate, setScheduleDate] = useState();
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const { orgUnit } = useOrganisationUnit(orgUnitId);
    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }
    return (<div className={classes.wrapper}>
        <Grid item xs={12} sm={12} md={10} lg={10}>
            <DataSection
                dataTest="schedule-section"
                sectionName={i18n.t('Schedule info')}
                fields={[
                    {
                        label: i18n.t('Schedule date / Due date', { interpolation: { escapeValue: false } }),
                        children: <DateField
                            value={scheduleDate}
                            calendarMinMoment={moment()}
                            width="100%"
                            calendarWidth={350}
                            onSetFocus={() => {}}
                            onFocus={() => { }}
                            onRemoveFocus={() => { }}
                            onBlur={(e) => { setScheduleDate(e); }}
                        />,
                    }]}
            />
            <BottomText
                programName={program.name}
                stageName={stage.name}
                orgUnitName={orgUnit?.name || ''}
                mode={textMode.SAVE}
            />
        </Grid>

    </div>);
}
;

export const WidgetEventSchedule: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetEventSchedulePlain);
