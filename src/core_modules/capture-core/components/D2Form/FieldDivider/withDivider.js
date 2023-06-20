// @flow
import { colors } from '@dhis2/ui';
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DividerHorizontal as Divider } from 'capture-ui';

const getStyles = () => ({
    dividerContainer: {
    },
    divider: {
        backgroundColor: colors.grey300,
    },
});

type Props = {
    formHorizontal: boolean,
    classes: {
        dividerContainer: string,
        divider: string,
    }
};

type Field = {
    props: {
        hidden?: ?boolean,
    }
};

export const withDivider = () => (InnerComponent: React.ComponentType<any>) => withStyles(getStyles)(
    class DividerHOC extends React.Component<Props> {
        renderDivider = (index: number, total: number, field: Field) => {
            if ((field.props && field.props.hidden) || (index + 1) >= total) {
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
        }

        render() {
            const { classes, ...passOnProps } = this.props;
            const formHorizontal = this.props.formHorizontal;
            const calculatedProps = !formHorizontal ? { onRenderDivider: this.renderDivider } : null;

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    {...calculatedProps}
                    {...passOnProps}
                />
            );
        }
    });
