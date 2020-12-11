// @flow
import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import type { VirtualizedOptionConfig } from './OptionsSelectVirtualized.component';

const getStyles = () => ({
    popper: {
        zIndex: 9999,
    },
    iconLeftContainer: {
        paddingRight: 5,
    },
    iconRightContainer: {
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
        iconLeftContainer: string,
        iconRightContainer: string,
    },
    inFocus: ?boolean,
    onFocusOption: (option: VirtualizedOptionConfig) => void,
};

class OptionsSelectVirtualizedOption extends Component<Props> {
    static defaultContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        paddingLeft: 5,
        overflow: 'hidden',
        paddingTop: 4,
        paddingBottom: 2,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    };

    static selectedStyle = {
        fontWeight: 'bold',
    };

    static inFocusStyle = {
        backgroundColor: 'rgba(0,0,0,0.1)',
    };

    render() {
        const { option, style, onSelect, currentlySelectedValues, classes, inFocus, onFocusOption } = this.props;
        const { label, iconLeft, iconRight } = option;
        const isSelected = !!currentlySelectedValues && currentlySelectedValues.includes(option);
        const renderStyle = {
            
            ...OptionsSelectVirtualizedOption.defaultContainerStyle,
            ...style,
            ...(currentlySelectedValues && currentlySelectedValues.includes(option) ? OptionsSelectVirtualizedOption.selectedStyle : null),
            ...(inFocus ? OptionsSelectVirtualizedOption.inFocusStyle : null),
        };
        return (
            <Tooltip
                title={option.label}
                placement="bottom"
                classes={{ popper: classes.popper }}
                enterDelay={800}
            >
                <div
                    className="virtualized-select-option"
                    style={renderStyle}
                    onClick={() => {
                        onSelect(option);
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    onMouseOver={() => onFocusOption(option)}
                >
                    {
                        iconLeft ? (
                            <div
                                className={classes.iconLeftContainer}
                            >
                                {iconLeft}
                            </div>
                        ) : null
                    }
                    <div>
                        {label}
                    </div>
                    {
                        iconRight ? (
                            <div
                                className={classes.iconRightContainer}
                            >
                                {iconRight}
                            </div>
                        ) : null
                    }
                </div>
            </Tooltip>
        );
    }
}

export default withStyles(getStyles)(OptionsSelectVirtualizedOption);
