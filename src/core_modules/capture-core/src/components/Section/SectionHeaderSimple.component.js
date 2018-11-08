// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
    container: {
        display: 'flex',
    },
    containerSecondary: {
        display: 'flex',
    },
    title: {
        ...theme.typography.title,
        fontSize: 16,
        fontWeight: 500,
        padding: 16,
    },
    children: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 5,
    },
});

type Props = {
    title: string | React$Element<any>,
    children?: ?React$Element<any>,
    secondary?: ?boolean,
    titleStyle?: ?Object,
    containerStyle?: ?Object,
    onChangeCollapseState?: ?() => void,
    isCollapsed?: ?boolean,
    extendedCollapsibility?: boolean,
    classes: Object
};

class SectionHeaderSimple extends Component<Props> {
    handleChangeCollapse: () => void;

    constructor(props: Props) {
        super(props);
        this.handleChangeCollapse = this.handleChangeCollapse.bind(this);
    }

    handleChangeCollapse() {
        // $FlowSuppress
        this.props.onChangeCollapseState();
    }

    render() {
        const { titleStyle, extendedCollapsibility, containerStyle, classes, secondary, onChangeCollapseState } = this.props;

        const containerProps = extendedCollapsibility ? { onTouchTap: this.handleChangeCollapse } : null;

        const accContainerStyle = extendedCollapsibility ? { ...containerStyle, ...{ cursor: 'pointer' } } : containerStyle;

        return (
            <div
                className={secondary ? classes.containerSecondary : classes.container}
                style={accContainerStyle}
                {...containerProps}
            >
                <div
                    className={classes.title}
                    style={titleStyle}
                >
                    {this.props.title}
                </div>
                <div
                    className={classes.children}
                >
                    {this.props.children}
                    {
                        (() => {
                            if (onChangeCollapseState) {
                                return (
                                    <IconButton
                                        title={this.props.isCollapsed ? 'Åpne' : 'Lukk'}
                                        onTouchTap={this.handleChangeCollapse}
                                    >
                                        <Icon>
                                            {this.props.isCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                                        </Icon>
                                    </IconButton>
                                );
                            }
                            return null;
                        })()
                    }
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SectionHeaderSimple);
