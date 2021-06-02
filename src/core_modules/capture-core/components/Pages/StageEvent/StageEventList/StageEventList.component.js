// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from '../StageEventListPage.types';

const getStyles = () => ({});

const StageEventListComponentPlain = () => (<>
    <div data-test="stage-event-list">Stages and Events</div>
</>);

export const StageEventListComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventListComponentPlain);
