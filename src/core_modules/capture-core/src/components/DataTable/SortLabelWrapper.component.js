// @flow
import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import i18n from '@dhis2/d2-i18n';
import getTableComponents from '../d2Ui/dataTable/getTableComponents';
import sortLabelAdapter from '../d2UiReactAdapters/dataTable/sortLabel.adapter';

import { directions } from '../d2UiReactAdapters/dataTable/componentGetters/sortLabel.const';

// $FlowSuppress
const { SortLabel } = getTableComponents(sortLabelAdapter);

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

class SortLabelWrapper extends React.Component<Props> {
    getIconClickHandler = (
        direction: $Values<typeof directions>,
        onSort: (direction: $Values<typeof directions>) => void) =>
        () => {
            if (!this.props.disabled) {
                onSort(direction);
            }
        }

    getActiveIcons = (direction?: ?$Values<typeof directions>,
        onSort: (direction: $Values<typeof directions>) => void,
    ) => {
        const isDisabled = this.props.disabled;
        const classes = this.props.classes;
        const IconComponent = direction === directions.ASC ? ArrowUpwardIcon : ArrowDownwardIcon;
        const icon = (
            <IconComponent
                className={isDisabled ? classes.iconBase : classNames(classes.iconBase, classes.enabledIcon)}
                onClick={this.getIconClickHandler(
                    direction === directions.DESC ? directions.ASC : directions.DESC,
                    onSort,
                )}
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
                enterDelay={300}
            >
                <span>
                    {icon}
                </span>
            </Tooltip>
        );
    }

    getIcons = (
        isActive: boolean,
        direction?: ?$Values<typeof directions>,
        onSort: (direction: $Values<typeof directions>,
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
                                enterDelay={300}
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
export default withStyles(styles)(SortLabelWrapper);
