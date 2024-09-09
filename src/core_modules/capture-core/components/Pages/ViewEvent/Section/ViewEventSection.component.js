// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core';
import { IconChevronDown24, IconChevronUp24, colors, Button } from '@dhis2/ui';

const getStyles = (theme: Theme) => ({
    container: {
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.typography.pxToRem(5),
        minHeight: theme.typography.pxToRem(42),

    },
    toggleCollapseButton: {
        padding: 4,
        border: 'none !important',
        borderRadius: '50% !important',
        width: theme.typography.pxToRem(28),
        marginLeft: theme.typography.pxToRem(2),
    },
    contentContainer: {
        padding: theme.typography.pxToRem(10),
        borderTop: `1px solid ${theme.palette.grey.blueGrey}`,
    },
});

type Props = {
    header: React.Element<any>,
    children: React.Element<any>,
    collapsable?: ?boolean,
    collapsed?: ?boolean,
    classes: Object,
}

type State = {
    collapsed: ?boolean,
}

class ViewEventSectionPlain extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: this.props.collapsed || false,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (nextProps.collapsed !== this.props.collapsed) {
            this.setState({
                collapsed: nextProps.collapsed,
            });
        }
    }

    toggleCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    renderCollapsable = () => {
        const classes = this.props.classes;
        const icon = this.state.collapsed ? <IconChevronDown24 /> : <IconChevronUp24 />;

        return (
            <Button
                icon={icon}
                onClick={this.toggleCollapse}
                className={classes.toggleCollapseButton}
                small
                secondary
            />
        );
    }

    renderContent = () => {
        const { children, classes } = this.props;
        return (
            <div className={classes.contentContainer}>
                {children}
            </div>
        );
    }

    render() {
        const { header, collapsable, classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.headerContainer}>
                    {header}
                    {collapsable && this.renderCollapsable()}
                </div>
                {!this.state.collapsed && this.renderContent()}
            </div>
        );
    }
}

export const ViewEventSection = withStyles(getStyles)(ViewEventSectionPlain);
