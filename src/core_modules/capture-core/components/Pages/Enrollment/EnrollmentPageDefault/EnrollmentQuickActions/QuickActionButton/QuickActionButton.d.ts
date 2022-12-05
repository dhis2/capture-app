import React from 'react';
import { WithStyles } from '@material-ui/core';
import type { QuickActionButtonTypes } from './QuickActionButton.types';
declare const styles: {
    button: {
        display: string;
        gap: any;
        alignItems: string;
    };
};
interface Props extends QuickActionButtonTypes, WithStyles<typeof styles> {
}
export declare const QuickActionButton: React.ComponentType<Pick<Props, "label" | "icon" | "dataTest" | "onClickAction" | "disable"> & import("@material-ui/core").StyledComponentProps<"button">>;
export {};
