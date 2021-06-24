// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { StageEventHeader } from './StageEventHeader/StageEventHeader.component';
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

const StageEventListPlain = ({ stage, classes }) => (<>
    <div data-test="stage-event-list" className={classes.wrapper}>
        <StageEventHeader title={stage.name} icon={stage.icon} events={[]} />
    </div>
</>);

export const StageEventList: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventListPlain);
