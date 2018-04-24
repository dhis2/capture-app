// @flow
import * as React from 'react';
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward';
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward';
import Icon from 'material-ui-next/Icon';

import getTableComponents from '../../../DataTable/d2Ui/getTableComponents';
import sortLabelAdapter from '../../../DataTable/d2UiReactAdapters/sortLabel.adapter'; 

import { directions } from '../../../DataTable/d2UiReactAdapters/componentGetters/sortLabel.const';

// $FlowSuppress
const { SortLabel } = getTableComponents(sortLabelAdapter);

type Props = {
    children?: ?React.Node,
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
                        onClick={this.getIconClickHandler(directions.DESC, onSort)}
                        style={{ width: 14, height: 14 }}
                    />
                )
                : (
                    <ArrowDownwardIcon
                        onClick={this.getIconClickHandler(directions.ASC, onSort)}
                        style={{ width: 14, height: 14 }}
                    />
                );
        }
        return (
            <span
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

export default SortLabelWrapper;
