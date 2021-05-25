// @flow
import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import i18n from '@dhis2/d2-i18n';
import { SortLabel, sortLabelDirections } from 'capture-ui';

const styles = () => ({
    iconBase: {
        width: '14px',
        height: '14px',
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
    static getDirectionBasedIconValues(direction?: ?$Values<typeof sortLabelDirections>) {
        if (direction === sortLabelDirections.ASC) {
            return {
                IconComponent: ArrowUpwardIcon,
                dataTestValue: 'data-table-asc-sort-icon',
                invertedDirection: sortLabelDirections.DESC,
            };
        }

        return {
            IconComponent: ArrowDownwardIcon,
            dataTestValue: 'data-table-desc-sort-icon',
            invertedDirection: sortLabelDirections.ASC,
        };
    }

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

        const { IconComponent, dataTestValue, invertedDirection } =
             SortLabelWrapper.getDirectionBasedIconValues(direction);

        const icon = (
            <IconComponent
                className={isDisabled ? classes.iconBase : classNames(classes.iconBase, classes.enabledIcon)}
                onClick={this.getIconClickHandler(invertedDirection, onSort)}
                data-test={dataTestValue}
            />
        );

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
