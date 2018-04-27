// @flow
import * as React from 'react';
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward';
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward';
import { withStyles } from 'material-ui-next/styles';

import getTableComponents from '../../../DataTable/d2Ui/getTableComponents';
import sortLabelAdapter from '../../../DataTable/d2UiReactAdapters/sortLabel.adapter'; 

import { directions } from '../../../DataTable/d2UiReactAdapters/componentGetters/sortLabel.const';

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
    getIconClickHandler = (direction: $Values<typeof directions>, onSort: (direction: $Values<typeof directions>) => void) => () => {
        onSort(direction);
    }

    getIcons = (isActive: boolean, direction?: ?$Values<typeof directions>, onSort: (direction: $Values<typeof directions>) => void) => {
        if (isActive) {
            return direction === directions.ASC
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
                {this.props.children}
            </SortLabel>
        );
    }
}

export default withStyles(styles)(SortLabelWrapper);
