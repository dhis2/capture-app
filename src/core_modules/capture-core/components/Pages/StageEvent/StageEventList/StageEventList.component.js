// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import type { Props } from '../StageEventListPage.types';

const getStyles = () => ({});

const StageEventListComponentPlain = () => (<>
    <div>Stages and Events</div>
</>);

export const StageEventListComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withStyles(getStyles),
  )(StageEventListComponentPlain);
