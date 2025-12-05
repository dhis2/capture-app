import { colors } from '@dhis2/ui';
import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { DividerHorizontal as Divider } from 'capture-ui';

const getStyles: Readonly<any> = () => ({
    dividerContainer: {
    },
    divider: {
        backgroundColor: colors.grey300,
    },
});

type Props = {
    formHorizontal: boolean;
} & WithStyles<typeof getStyles>;

export const withDivider = () => (InnerComponent: React.ComponentType<any>) => withStyles(getStyles)(
    class DividerHOC extends React.Component<Props> {
        renderDivider = (index: number, total: number, hidden: boolean) => {
            if (hidden || (index + 1) >= total) {
                return null;
            }

            const classes = this.props.classes;

            return (
                <div
                    className={classes.dividerContainer}
                >
                    <Divider
                        className={classes.divider}
                    />
                </div>
            );
        };

        render() {
            const { classes, ...passOnProps } = this.props;
            const formHorizontal = this.props.formHorizontal;
            const calculatedProps = !formHorizontal ? { onRenderDivider: this.renderDivider } : null;

            return (
                <InnerComponent
                    {...calculatedProps}
                    {...passOnProps}
                />
            );
        }
    });
