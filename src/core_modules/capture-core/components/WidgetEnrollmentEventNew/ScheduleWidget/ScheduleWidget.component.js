

// @flow
import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { DataSection } from '../../DataSection';
import type { Props } from './scheduleWidget.types';

const styles = () => ({
    wrapper: {
        padding: `${spacersNum.dp16}px 0`,
    },
});
const ScheduleWidgetPlain = ({ classes }: Props) => (
    <div className={classes.wrapper}>
        <DataSection dataTest="schedule-section" sectionName={i18n.t('Schedule info')}>
            <div>Hello world</div>
        </DataSection>
    </div>

);

export const ScheduleWidget: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ScheduleWidgetPlain);
