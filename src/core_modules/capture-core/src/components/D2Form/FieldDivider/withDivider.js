// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '../../d2UiReactAdapters/Divider/DividerHorizontal.component';

const getStyles = (theme: Theme) => ({
    dividerContainer: {
    },
    divider: {
        backgroundColor: theme.palette.dividerForm,
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

export default () => (InnerComponent: React.ComponentType<any>) => withStyles(getStyles)(
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
                <InnerComponent
                    {...calculatedProps}
                    {...passOnProps}
                />
            );
        }
    });
