import { colors } from '@dhis2/ui';
import React, { Component, type ReactElement, type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles: Readonly<any> = {
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: `1px solid ${colors.grey300}`,
    },
    mainActionButton: {
        position: 'absolute',
        right: 15,
        top: 30,
    },
};

type OwnProps = {
    children?: ReactElement;
    style?: Record<string, any>;
    contentStyle?: Record<string, any>;
    mainActionButton?: ReactElement;
    header?: ReactElement;
    description?: ReactElement;
    isCollapsed?: boolean;
    onChangeCollapseState?: () => void;
    extendedCollapsibility?: boolean;
    className?: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

class SectionPlain extends Component<Props> {
    getHeader() {
        const orgHeader = this.props.header;

        if (orgHeader && React.isValidElement(orgHeader) && (orgHeader.type as any)?.name === 'SectionHeaderSimple' && this.props.onChangeCollapseState) {
            const clonedHeader = React.cloneElement(orgHeader as any, {
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
        const accContentStyle = { ...contentStyle, ...(isCollapsed ? { display: 'none' } : {}) };
        const mainActionButtonElement = mainActionButton ?
            (
                <div className={classes.mainActionButton}>
                    {mainActionButton}
                </div>
            ) : null;

        return (
            <div>
                {this.getHeader()}
                {this.props.description}
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
        const { style, className } = this.props;
        const containerClass = classNames(this.props.classes.container, className);
        return (
            <div className={containerClass} style={style}>
                {this.renderContents()}
            </div>
        );
    }
}

export const Section = withStyles(styles)(SectionPlain) as ComponentType<OwnProps>;
