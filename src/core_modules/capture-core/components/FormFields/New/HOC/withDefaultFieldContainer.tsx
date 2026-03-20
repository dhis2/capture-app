import { colors } from '@dhis2/ui';
import * as React from 'react';
import { cx } from '@emotion/css';
import { WithStyles, withStyles } from 'capture-core-utils/styles';

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

type ContainerState = 'active' | 'validating' | 'error' | 'warning' | 'info' | 'default';

const getContainerState = (
    { inFocus, validatingMessage, errorMessage, warningMessage, infoMessage }: Props,
): ContainerState => {
    if (inFocus) return 'active';
    if (validatingMessage) return 'validating';
    if (errorMessage) return 'error';
    if (warningMessage) return 'warning';
    if (infoMessage) return 'info';
    return 'default';
};

const getFieldContainerBuilder = (InnerComponent: React.ComponentType<any>, customStyles?: any | null) =>
    class FieldContainerBuilder extends React.Component<Props & WithStyles<typeof styles>> {
        render() {
            const { classes, ...passOnProps } = this.props;
            const state = getContainerState(passOnProps);
            const containerClasses = cx(
                classes.container, {
                    [classes.activeContainer]: state === 'active',
                    [classes.validatingContainer]: state === 'validating',
                    [classes.errorContainer]: state === 'error',
                    [classes.warningContainer]: state === 'warning',
                    [classes.infoContainer]: state === 'info',
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
