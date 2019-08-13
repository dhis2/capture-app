// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';

const getStyles = (theme: Theme) => ({
    headerContainer: {
        padding: theme.typography.pxToRem(24),
        borderColor: theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8),
        borderWidth: '0 0 1px 0',
        borderStyle: 'solid',
    },
    listContainer: {
        padding: theme.typography.pxToRem(24),
    },
});

type Props = {
    header: React.Node,
    classes: {
        headerContainer: string,
        listContainer: string,
    },
};

export default () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)(class withListHeaderWrapper extends React.Component<Props> {
        render() {
            const { header, classes, ...passOnProps } = this.props;
            return (
                <Paper>
                    <div
                        className={classes.headerContainer}
                    >
                        {header}
                    </div>
                    <div
                        className={classes.listContainer}
                    >
                        <InnerComponent
                            {...passOnProps}
                        />
                    </div>
                </Paper>
            );
        }
    });
