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
            if ((field.props && field.props.hidden) || this.props.formHorizontal || (index + 1) >= total) {
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
            const { formHorizontal, classes, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    onRenderDivider={this.renderDivider}
                    {...passOnProps}
                />
            );
        }
    });
