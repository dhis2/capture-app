// @flow
import { withStyles } from '@material-ui/core';
import React, { type ComponentType } from 'react';
import type { Props } from './WidgetManagements.types';
import { WidgetManagementsComponent } from './WidgetManagements.component';

const styles = {

};

const WidgetManagementsContainer = () => <WidgetManagementsComponent />;

export const WidgetManagements: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(WidgetManagementsContainer);
