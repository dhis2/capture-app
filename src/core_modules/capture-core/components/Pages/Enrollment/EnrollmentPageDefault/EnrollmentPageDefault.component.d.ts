import React from 'react';
import { WithStyles } from '@material-ui/core';
import type { PlainProps } from './EnrollmentPageDefault.types';
declare const getStyles: import("@material-ui/core/styles/withStyles").StyleRules<"title" | "columns" | "leftColumn" | "rightColumn">;
interface PropsFromStyles extends PlainProps, WithStyles<typeof getStyles> {
}
export declare const EnrollmentPageDefaultPlain: ({ program, teiId, orgUnitId, events, enrollmentId, stages, onDelete, onAddNew, onViewAll, onCreateNew, widgetEffects, hideWidgets, onEventClick, onUpdateTeiAttributeValues, onEnrollmentError, classes, }: PropsFromStyles) => JSX.Element;
export declare const EnrollmentPageDefaultComponent: React.ComponentType<Pick<PropsFromStyles, "program" | "stages" | "events" | "teiId" | "orgUnitId" | "onDelete" | "enrollmentId" | "onUpdateTeiAttributeValues" | "onAddNew" | "widgetEffects" | "hideWidgets" | "onEnrollmentError" | "onEventClick" | "onViewAll" | "onCreateNew"> & import("@material-ui/core").StyledComponentProps<"title" | "columns" | "leftColumn" | "rightColumn">>;
export {};
