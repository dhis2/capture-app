// @flow
import * as React from 'react';
import classNames from 'classnames';
import { SortLabel, sortLabelDirections } from 'capture-ui';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { IconArrowDown16, IconArrowUp16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';


const styles = () => ({
    iconBase: {
        color: '#3a796f',
    },
    enabledIcon: {
        cursor: 'pointer',
    },
});

type Props = {
    children?: ?React.Node,
    classes: {
        iconBase: string,
        enabledIcon: string,
    },
    disabled?: ?boolean,
};

class SortLabelWrapperPlain extends React.Component<Props> {
    getIconClickHandler = (
        direction: $Values<typeof sortLabelDirections>,
        onSort: (direction: $Values<typeof sortLabelDirections>) => void) =>
        () => {
            if (!this.props.disabled) {
                onSort(direction);
            }
        }

    getActiveIcons = (direction?: ?$Values<typeof sortLabelDirections>,
        onSort: (direction: $Values<typeof sortLabelDirections>) => void,
    ) => {
        const isDisabled = this.props.disabled;
        const classes = this.props.classes;

        const icon =
            direction === sortLabelDirections.ASC ?
                (<div
                    className={isDisabled ? classes.iconBase : classNames(classes.iconBase, classes.enabledIcon)}
                    role="button"
                    tabIndex="0"
                    onClick={this.getIconClickHandler(sortLabelDirections.DESC, onSort)}
                    data-test="data-table-asc-sort-icon"
                >
                    <IconArrowUp16 />
                </div>) :
                (<div
                    className={isDisabled ? classes.iconBase : classNames(classes.iconBase, classes.enabledIcon)}
                    role="button"
                    tabIndex="0"
                    onClick={this.getIconClickHandler(sortLabelDirections.ASC, onSort)}
                    data-test="data-table-desc-sort-icon"

                >
                    <IconArrowDown16 />
                </div>);

        if (this.props.disabled) {
            return (
                <span>
                    {icon}
                </span>
            );
        }

        return (
            <Tooltip
                title={i18n.t('Sort')}
                placement={'bottom'}
                enterDelay={500}
            >
                <span>
                    {icon}
                </span>
            </Tooltip>
        );
    }

    getIcons = (
        isActive: boolean,
        direction?: ?$Values<typeof sortLabelDirections>,
        onSort: (direction: $Values<typeof sortLabelDirections>,
    ) => void) => {
        if (isActive) {
            return this.getActiveIcons(direction, onSort);
        }
        return (
            <div
                style={{ width: 14, height: 14 }}
            />
        );
    }

    render() {
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <SortLabel
                onGetIcons={this.getIcons}
                {...this.props}
            >
                {
                    (() => {
                        if (this.props.disabled) {
                            return (
                                <span>
                                    {this.props.children}
                                </span>
                            );
                        }
                        return (
                            <Tooltip
                                title={i18n.t('Sort')}
                                placement={'bottom'}
                                enterDelay={500}
                            >
                                <span>
                                    {this.props.children}
                                </span>
                            </Tooltip>
                        );
                    })()
                }
            </SortLabel>
        );
    }
}

/**
 * A wrapper for the d2-ui/dataTable/sortLabel component. Adds sort tooltip and icons
 * @alias SortLabelWrapper
 * @memberof DataTable
 */
export const SortLabelWrapper = withStyles(styles)(SortLabelWrapperPlain);
