// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

type Props = {
    classes: Object
};

const styles = theme => ({
    container: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
    },
});

const getFieldContainerBuilder = (InnerComponent: React.ComponentType<any>, customStyles?: ?Object) =>
    class FieldContainerBuilder extends React.Component<Props> {
        render() {
            const { classes, ...passOnProps } = this.props;

            return (
                <div
                    className={classes.container}
                    style={customStyles}
                >
                    <InnerComponent
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export default (customStyles?: ?Object) =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getFieldContainerBuilder(InnerComponent, customStyles));
