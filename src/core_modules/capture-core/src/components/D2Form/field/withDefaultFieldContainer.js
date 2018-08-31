// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
    container: {
        padding: 16,
    },
    activeContainer: {
        backgroundColor: theme.palette.accent.lighter,
    },
    validatingContainer: {},
    errorContainer: {
        backgroundColor: theme.palette.error.lighter,
    },
    warningContainer: {
        backgroundColor: theme.palette.warning.lighter,
    },
    infoContainer: {},
});

type Props = {
    classes: {
        container: string,
        activeContainer: string,
        validatingContainer: string,
        errorContainer: string,
        warningContainer: string,
        infoContainer: string,
    },
    active: boolean,
    validatingMessage?: ?string,
    errorMessage?: ?string,
    warningMessage?: ?string,
    infoMessage?: ?string,
};

const getFieldContainerBuilder = (InnerComponent: React.ComponentType<any>, customStyles?: ?Object) =>
    class FieldContainerBuilder extends React.Component<Props> {
        render() {
            const { classes, ...passOnProps } = this.props;
            const containerClasses = classNames(
                classes.container, {
                    [classes.activeContainer]: passOnProps.active,
                    [classes.validatingContainer]: passOnProps.validatingMessage && !passOnProps.active,
                    [classes.errorContainer]:
                        passOnProps.errorMessage && !passOnProps.active && !passOnProps.validatingMessage,
                    [classes.warningContainer]:
                        passOnProps.warningMessage && !passOnProps.active &&
                        !passOnProps.validatingMessage && !passOnProps.errorMessage,
                    [classes.infoContainer]:
                        passOnProps.infoMessage && !passOnProps.active &&
                        !passOnProps.validatingMessage && !passOnProps.errorMessage && !passOnProps.warningMessage,
                },
            );

            return (
                <div
                    className={containerClasses}
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
