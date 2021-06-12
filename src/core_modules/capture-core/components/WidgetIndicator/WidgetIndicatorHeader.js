// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';

type Props = {|
    numberOfIndicators?: ?number,
    ...CssClasses,
|}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    label: {
        margin: 0,
    },
    headerPill: {
        width: '19px',
        height: '16px',
        lineHeight: '16px',
        backgroundColor: '#D5DDE5',
        fontSize: '10px',
        textAlign: 'center',
        borderRadius: '20px',
        fontWeight: 700,
    },
};

const WidgetIndicatorHeaderPlain = ({ numberOfIndicators, classes }: Props) => (
    <div className={classes.container}>
        <p className={classes.label}>Indicators</p>
        {numberOfIndicators ? <div className={classes.headerPill}>{numberOfIndicators}</div> : null}
    </div>
);

export const WidgetIndicatorHeader: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetIndicatorHeaderPlain);
