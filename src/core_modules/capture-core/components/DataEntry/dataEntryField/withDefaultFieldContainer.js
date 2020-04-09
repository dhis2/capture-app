// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';

type Props = {
    classes: Object
};

const styles = theme => ({
    container: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
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
