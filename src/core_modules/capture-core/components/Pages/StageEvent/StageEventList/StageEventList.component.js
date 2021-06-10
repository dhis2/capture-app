// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { StageEventHeaderComponent } from './StageEventHeader/StageEventHeader.component';
import type { Props } from './StageEventList.types';

const getStyles = () => ({
    wrapper: {
        backgroundColor: colors.white,
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
    },
});

const StageEventListComponentPlain = ({ stage, classes }) => (<>
    <div data-test="stage-event-list" className={classes.wrapper}>
        <StageEventHeaderComponent title={stage.name} icon={stage.icon} events={[]} />
    </div>
</>);

export const StageEventListComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventListComponentPlain);
