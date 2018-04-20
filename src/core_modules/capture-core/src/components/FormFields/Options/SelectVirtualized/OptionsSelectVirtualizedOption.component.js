// @flow
import React, { Component } from 'react';

import type { virtualizedOptionConfig } from './OptionsSelectVirtualized.component';

type Props = {
    option: virtualizedOptionConfig,
    style: Object,
    onSelect: (selectedOption: virtualizedOptionConfig) => void,
    currentlySelectedValues: ?Array<virtualizedOptionConfig>
};

class OptionsSelectVirtualizedOption extends Component<Props> {
    static defaultContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    };

    static selectedStyle = {};

    render() {
        const { option, style, onSelect, currentlySelectedValues } = this.props;
        const { label } = option;
        const renderStyle = Object.assign({}, OptionsSelectVirtualizedOption.defaultContainerStyle, style, currentlySelectedValues && currentlySelectedValues.includes(option) ? OptionsSelectVirtualizedOption.selectedStyle : null);

        return (
            <div
                className={'virtualized-select-option'}
                style={renderStyle}
                onClick={() => {
                    onSelect(option);
                }}
            >
                {label}
            </div>
        );
    }
}

export default OptionsSelectVirtualizedOption;
