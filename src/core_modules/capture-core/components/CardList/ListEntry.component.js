// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { colors } from '@dhis2/ui-core';

type Props = {|
  name: string,
  value: string
|}

const getStyles = (theme: Theme) => ({
    elementName: {
        fontSize: theme.typography.pxToRem(13),
        color: colors.grey700,

    },
    elementValue: {
        fontSize: theme.typography.pxToRem(14),
        color: colors.grey900,
        fontWeight: 500,
    },
    entry: {
        paddingBottom: theme.typography.pxToRem(4),
    },
});

export const ListEntry =
   withStyles(getStyles)(({ name, value, classes }: Props & CssClasses) => (
       <div className={classes.entry}>
           <span className={classes.elementName}>
               {name}:&nbsp;
           </span>
           <span className={classes.elementValue}>
               {value}
           </span>
       </div>));
