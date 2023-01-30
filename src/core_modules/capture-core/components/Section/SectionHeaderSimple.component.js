// @flow
import { colors } from '@dhis2/ui';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import { IconChevronDown24, IconChevronUp24 } from '@dhis2/ui';

const styles = () => ({
    container: {
        display: 'flex',
    },
    containerSecondary: {
        display: 'flex',
    },
    title: {
        color: colors.grey900,
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: colors.grey300,
        padding: '4px 8px',
        marginBottom: '8px',
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
    isCollapseButtonEnabled?: boolean,
    classes: Object
};

class SectionHeaderSimplePlain extends Component<Props> {
    handleChangeCollapse: () => void;

    static defaultProps = {
        isCollapseButtonEnabled: true,
    };

    constructor(props: Props) {
        super(props);
        this.handleChangeCollapse = this.handleChangeCollapse.bind(this);
    }

    handleChangeCollapse() {
        // $FlowFixMe[not-a-function] automated comment
        this.props.onChangeCollapseState();
    }

    render() {
        const { titleStyle, extendedCollapsibility, containerStyle, classes, secondary, onChangeCollapseState } = this.props;

        const containerProps = extendedCollapsibility ? { onClick: this.handleChangeCollapse } : null;

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
                                        data-test="collapsible-button"
                                        disabled={!this.props.isCollapseButtonEnabled}
                                        title={this.props.isCollapsed ? 'Open' : 'Close'}
                                        onClick={this.handleChangeCollapse}
                                    >
                                        {this.props.isCollapsed ? <IconChevronDown24 /> : <IconChevronUp24 />}
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

export const SectionHeaderSimple = withStyles(styles)(SectionHeaderSimplePlain);
