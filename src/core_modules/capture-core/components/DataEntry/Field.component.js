// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DividerHorizontal as Divider } from 'capture-ui';
import { placements } from './constants/placements.const';

const styles = theme => ({
    evenNumbers: {
        backgroundColor: theme.palette.grey.lightest,
    },
    divider: {
        backgroundColor: theme.palette.dividerForm,
    },
});
type Props = {
    formHorizontal: ?boolean,
    index: number,
    total: number,
    fieldContainer: {
        field: React.Element<any>,
        placement: $Values<typeof placements>,
        section?: ?string,
    },
    ...CssClasses
}

const FieldPlain = (props: Props) => {
    const { formHorizontal, index, fieldContainer, total, classes } = props;

    const className = !formHorizontal ? index % 2 !== 0 && classes.evenNumbers : null;
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
