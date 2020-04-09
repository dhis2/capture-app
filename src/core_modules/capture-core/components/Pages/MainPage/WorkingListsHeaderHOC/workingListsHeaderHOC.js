// @flow
import i18n from '@dhis2/d2-i18n';
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { darken, fade, lighten } from '@material-ui/core/styles';
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
    title: {
        ...theme.typography.title,
    },
});

type Props = {
    classes: {
        headerContainer: string,
        listContainer: string,
        title: string,
    },
};

const withWorkingListsHeader = () => (InnerComponent: React.ComponentType<any>) =>
    // $FlowFixMe
    withStyles(getStyles)(class WorkingListsHeaderHOC extends React.Component<Props> {
        render() {
            const { classes, ...passOnProps } = this.props;
            return (
                <Paper>
                    <div
                        className={classes.headerContainer}
                    >
                        <span
                            className={classes.title}
                        >
                            {i18n.t('Registered events')}
                        </span>
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

export default withWorkingListsHeader;
