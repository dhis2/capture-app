// @flow
import { colors } from '@dhis2/ui';
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    container: {
        padding: '8px 8px 8px 12px',
    },
    activeContainer: {
        backgroundColor: colors.blue100,
    },
    validatingContainer: {},
    errorContainer: {
        backgroundColor: colors.red100,
    },
    warningContainer: {
        backgroundColor: colors.yellow100,
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
