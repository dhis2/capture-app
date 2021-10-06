

// @flow
import React, { type ComponentType, useState } from 'react';
import { spacersNum } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { DateField } from 'capture-core/components/FormFields/New';
import { DataSection } from '../../DataSection';
import { BottomText, textMode } from '../BottomText';
import type { Props } from './scheduleWidget.types';


const styles = () => ({
    wrapper: {
        padding: `${spacersNum.dp16}px 0`,
    },
});
const ScheduleWidgetPlain = ({ stage, program, classes }: Props) => {
    const [scheduleDate, setScheduleDate] = useState();

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
                orgUnitName={undefined}
                mode={textMode.SAVE}
            />
        </Grid>

    </div>);
}
;

export const ScheduleWidget: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ScheduleWidgetPlain);
