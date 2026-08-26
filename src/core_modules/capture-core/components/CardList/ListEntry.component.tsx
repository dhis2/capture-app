import React from 'react';
import { withStyles } from 'capture-core-utils/styles';
import type { WithStyles } from 'capture-core-utils/styles';
import { colors } from '@dhis2/ui';
import { convertValue } from '../../converters/clientToView';
import { DataElement, dataElementTypes } from '../../metaData';

const styles = (theme: any) => ({
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

type BaseProps = {
    name: string;
    value?: string | null;
    type?: keyof typeof dataElementTypes;
    dataElement?: DataElement;
};

type Props = BaseProps & WithStyles<typeof styles>;

const ListEntryComponent: React.FC<Props> = ({
    name,
    value,
    classes,
    type = dataElementTypes.TEXT,
    dataElement,
}) => {
    if (!value) {
        return null;
    }

    return (
        <div className={classes.entry}>
            <span className={classes.elementName}>
                {name}:&nbsp;
            </span>
            <span className={classes.elementValue}>
                {convertValue(value, type, dataElement)}
            </span>
        </div>
    );
};

export const ListEntry = withStyles(styles)(ListEntryComponent) as React.ComponentType<BaseProps>;
