// @flow

import * as React from 'react';
import { withStyles, IconButton, Paper } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

const getStyles = (theme: Theme) => ({
    container: {
        margin: theme.typography.pxToRem(10),
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

class ViewEventSection extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: this.props.collapsed || false,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
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
        return (
            <IconButton className={classes.toggleCollapseButton} onClick={this.toggleCollapse}>
                {this.state.collapsed ?
                    <ArrowDropDown /> :
                    <ArrowDropUp />
                }
            </IconButton>

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
            <Paper className={classes.container}>
                <div className={classes.headerContainer}>
                    {header}
                    {collapsable && this.renderCollapsable()}
                </div>
                {!this.state.collapsed && this.renderContent()}
            </Paper>
        );
    }
}

export default withStyles(getStyles)(ViewEventSection);
