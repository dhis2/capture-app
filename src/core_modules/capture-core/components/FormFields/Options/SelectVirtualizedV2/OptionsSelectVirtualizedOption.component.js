// @flow
import React, { Component } from 'react';
import { Tooltip } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { VirtualizedOptionConfig } from './OptionsSelectVirtualized.component';

const getStyles = () => ({
    popper: {
        zIndex: 9999,
    },
    iconContainer: {
        paddingLeft: 5,
    },
});

type Props = {
    option: VirtualizedOptionConfig,
    style: Object,
    onSelect: (selectedOption: VirtualizedOptionConfig) => void,
    currentlySelectedValues: ?Array<VirtualizedOptionConfig>,
    classes: {
        popper: string,
        iconContainer: string,
    },
    inFocus: ?boolean,
    onFocusOption: (option: VirtualizedOptionConfig) => void,
};

class OptionsSelectVirtualizedOptionPlain extends Component<Props> {
    static defaultContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        cursor: 'default',
        paddingLeft: 8,
        overflow: 'hidden',
        paddingTop: 4,
        paddingBottom: 2,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: 14,
    };

    static selectedStyle = {
        fontWeight: '600',
        backgroundColor: '#fbfcfd',
    };

    static inFocusStyle = {
        backgroundColor: '#f3f5f7',
    };

    render() {
        const { option, style, onSelect, currentlySelectedValues, classes, inFocus, onFocusOption } = this.props;
        const { label, icon } = option;
        const isSelected = !!currentlySelectedValues && currentlySelectedValues.includes(option);
        const renderStyle = Object.assign(
            {},
            OptionsSelectVirtualizedOption.defaultContainerStyle,
            style,
            currentlySelectedValues && currentlySelectedValues.includes(option) ? OptionsSelectVirtualizedOption.selectedStyle : null,
            inFocus ? OptionsSelectVirtualizedOption.inFocusStyle : null,
        );
        return (
            <Tooltip
                content={option.label}
                placement={'bottom'}
                openDelay={800}
            >
                <div
                    className={'virtualized-select-option'}
                    style={renderStyle}
                    onClick={() => {
                        onSelect(option);
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    onMouseOver={() => onFocusOption(option)}
                >
                    <div>
                        {label}
                    </div>
                    {
                        icon ? (
                            <div
                                className={classes.iconContainer}
                            >
                                {icon}
                            </div>
                        ) : null
                    }
                </div>
            </Tooltip>
        );
    }
}

export const OptionsSelectVirtualizedOption = withStyles(getStyles)(OptionsSelectVirtualizedOptionPlain);
