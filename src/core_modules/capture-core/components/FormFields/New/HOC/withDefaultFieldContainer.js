// @flow
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import * as React from 'react';

const styles = (theme: Theme) => ({
    container: {
        padding: '8px 8px 8px 12px',
    },
    activeContainer: {
        backgroundColor: theme.palette.info.main,
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
    inFocus?: ?boolean,
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
                    [classes.activeContainer]: passOnProps.inFocus,
                    [classes.validatingContainer]: passOnProps.validatingMessage && !passOnProps.inFocus,
                    [classes.errorContainer]:
                        passOnProps.errorMessage && !passOnProps.inFocus && !passOnProps.validatingMessage,
                    [classes.warningContainer]:
                        passOnProps.warningMessage && !passOnProps.inFocus &&
                        !passOnProps.validatingMessage && !passOnProps.errorMessage,
                    [classes.infoContainer]:
                        passOnProps.infoMessage && !passOnProps.inFocus &&
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

export const withDefaultFieldContainer = (customStyles?: ?Object) =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getFieldContainerBuilder(InnerComponent, customStyles));
