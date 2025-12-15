import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { DividerHorizontal as Divider } from 'capture-ui';
import type { ReactElement } from 'react';
import { placements } from './constants/placements.const';

const styles: Readonly<any> = (theme: any) => ({
    evenNumbers: {
        backgroundColor: theme.palette.grey.lightest,
    },
    divider: {
        backgroundColor: theme.palette.dividerForm,
    },
});

type Props = {
    formHorizontal?: boolean;
    index: number;
    total: number;
    fieldContainer: {
        field: ReactElement<any>;
        placement: typeof placements[keyof typeof placements];
        section?: string;
    };
};

const FieldPlain = (props: Props & WithStyles<typeof styles>) => {
    const { formHorizontal, index, fieldContainer, total, classes } = props;

    const className = !formHorizontal && index % 2 !== 0 ? classes.evenNumbers : '';
    const shouldRenderDivider = !formHorizontal ? index + 1 < total : null;

    return (
        <div
            className={className}
        >
            { fieldContainer.field }
            {shouldRenderDivider &&
                <Divider
                    className={classes.divider}
                />
            }
        </div>
    );
};

export const Field = withStyles(styles)(FieldPlain);
