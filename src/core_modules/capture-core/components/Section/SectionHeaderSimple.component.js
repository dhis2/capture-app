// @flow
import { colors } from '@dhis2/ui';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ChevronIcon } from 'capture-ui';

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
                <div>
                    <div
                        className={classes.title}
                        style={titleStyle}
                    >
                        {this.props.title}
                    </div>
                </div>
                <div
                    className={classes.children}
                >
                    {this.props.children}
                    {
                        (() => {
                            if (onChangeCollapseState) {
                                return (
                                    <ChevronIcon
                                        open={!this.props.isCollapsed}
                                        onOpen={this.handleChangeCollapse}
                                        onClose={this.handleChangeCollapse}
                                        disabled={!this.props.isCollapseButtonEnabled}
                                        dataTest={'collapsible-button'}
                                    />
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
