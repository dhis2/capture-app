// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    mainActionButton: {
        position: 'absolute',
        right: 15,
        top: 30,
    },
});

type Props = {
    children?: ?React$Element<any>,
    style?: ?Object,
    contentStyle?: ?Object,
    elevation?: ?number,
    mainActionButton?: ?React$Element<any>,
    header?: ?React$Element<any>,
    isCollapsed?: ?boolean,
    onChangeCollapseState?: ?() => void,
    extendedCollapsibility?: boolean,
    classes: any,
};

class Section extends Component<Props> {
    getHeader() {
        const orgHeader = this.props.header;

        if (orgHeader && orgHeader.type && orgHeader.type.name === 'SectionHeaderSimple' && this.props.onChangeCollapseState) {
            const clonedHeader = React.cloneElement(orgHeader, {
                onChangeCollapseState: this.props.onChangeCollapseState,
                isCollapsed: this.props.isCollapsed,
                extendedCollapsibility: this.props.extendedCollapsibility,
            });
            return clonedHeader;
        }
        return orgHeader;
    }

    renderContents() {
        const { isCollapsed, contentStyle, mainActionButton, classes } = this.props;
        const showChildren = !isCollapsed;
        const accContentStyle = Object.assign({}, contentStyle, isCollapsed ? { display: 'none' } : null);
        const mainActionButtonElement = mainActionButton ?
            (
                <div className={classes.mainActionButton}>
                    {mainActionButton}
                </div>
            ) : null;

        return (
            <div>
                {this.getHeader()}
                <div style={accContentStyle}>
                    {mainActionButtonElement}
                    {
                        (() => {
                            if (showChildren) {
                                return this.props.children;
                            }
                            return null;
                        })()
                    }
                </div>
            </div>
        );
    }

    render() {
        const { elevation, style } = this.props;

        if (elevation) {
            return (
                <Paper elevation={elevation} style={style} className={this.props.classes.container}>
                    {this.renderContents()}
                </Paper>
            );
        }

        return (
            <div className={this.props.classes.container}>
                {this.renderContents()}
            </div>
        );
    }
}

export default withStyles(styles)(Section);
