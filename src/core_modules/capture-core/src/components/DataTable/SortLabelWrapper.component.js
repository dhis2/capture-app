// @flow
import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { withStyles } from '@material-ui/core/styles';

import { getTranslation } from '../../d2/d2Instance';
import { formatterOptions } from '../../utils/string/format.const';
import getTableComponents from '../d2Ui/dataTable/getTableComponents';
import sortLabelAdapter from '../d2UiReactAdapters/dataTable/sortLabel.adapter';

import { directions } from '../d2UiReactAdapters/dataTable/componentGetters/sortLabel.const';

// $FlowSuppress
const { SortLabel } = getTableComponents(sortLabelAdapter);

const styles = theme => ({
    icon: {
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        color: theme.palette.secondary.main,
    },
});

type Props = {
    children?: ?React.Node,
    classes: {
        icon: string,
    }
};

class SortLabelWrapper extends React.Component<Props> {
    getIconClickHandler = (
        direction: $Values<typeof directions>,
        onSort: (direction: $Values<typeof directions>) => void) =>
        () => {
            onSort(direction);
        }

    getIcons = (
        isActive: boolean,
        direction?: ?$Values<typeof directions>,
        onSort: (direction: $Values<typeof directions>) => void) => {
        if (isActive) {
            const icon = direction === directions.ASC
                ? (
                    <ArrowUpwardIcon
                        className={this.props.classes.icon}
                        onClick={this.getIconClickHandler(directions.DESC, onSort)}
                    />
                )
                : (
                    <ArrowDownwardIcon
                        className={this.props.classes.icon}
                        onClick={this.getIconClickHandler(directions.ASC, onSort)}
                    />
                );

            return (
                <Tooltip
                    title={getTranslation('sort', formatterOptions.CAPITALIZE_FIRST_LETTER)}
                    placement={'bottom'}
                    enterDelay={300}
                >
                    <span>
                        {icon}
                    </span>
                </Tooltip>
            );
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
                <Tooltip
                    title={getTranslation('sort', formatterOptions.CAPITALIZE_FIRST_LETTER)}
                    placement={'bottom'}
                    enterDelay={300}
                >
                    <span>
                        {this.props.children}
                    </span>
                </Tooltip>
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
