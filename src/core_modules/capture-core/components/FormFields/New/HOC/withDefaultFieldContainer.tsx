import { colors } from '@dhis2/ui';
import * as React from 'react';
import classNames from 'classnames';
import { WithStyles, withStyles } from '@material-ui/core/styles';

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
    inFocus?: boolean | null;
    validatingMessage?: string | null;
    errorMessage?: string | null;
    warningMessage?: string | null;
    infoMessage?: string | null;
};

const getFieldContainerBuilder = (InnerComponent: React.ComponentType<any>, customStyles?: any | null) =>
    class FieldContainerBuilder extends React.Component<Props & WithStyles<typeof styles>> {
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
                    style={customStyles as React.CSSProperties}
                >
                    <InnerComponent
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export const withDefaultFieldContainer = (customStyles?: any | null) =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getFieldContainerBuilder(InnerComponent, customStyles));
