// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors } from '@dhis2/ui';
import { convertValue } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData';

type Props = {|
    name: string,
    value?: string,
    type?: $Values<typeof dataElementTypes>,
    dataElement?: Object,
  ...CssClasses
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

const ListEntryPlain = ({
    name,
    value,
    classes,
    type = dataElementTypes.TEXT,
    dataElement,
}: Props) => (value ? <div className={classes.entry}>
    <span className={classes.elementName}>
        {name}:&nbsp;
    </span>
    <span className={classes.elementValue}>
        {convertValue(value, type, dataElement)}
    </span>
</div> : null);

export const ListEntry: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(ListEntryPlain);
