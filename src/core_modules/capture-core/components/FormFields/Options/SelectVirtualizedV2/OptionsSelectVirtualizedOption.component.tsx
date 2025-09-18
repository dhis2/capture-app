import React, { Component } from 'react';
import { Tooltip } from '@dhis2/ui';
import { WithStyles, withStyles } from '@material-ui/core/styles';
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
    option: VirtualizedOptionConfig;
    style: any;
    onSelect: (selectedOption: VirtualizedOptionConfig) => void;
    currentlySelectedValues: Array<VirtualizedOptionConfig> | null;
    inFocus: boolean | null;
    onFocusOption: (option: VirtualizedOptionConfig) => void;
} & WithStyles<typeof getStyles>;

class OptionsSelectVirtualizedOptionPlain extends Component<Props> {
    static defaultContainerStyle: any = {
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

    static selectedStyle: any = {
        fontWeight: '600',
        backgroundColor: '#fbfcfd',
    };

    static inFocusStyle: any = {
        backgroundColor: '#f3f5f7',
    };

    render() {
        const { option, style, onSelect, currentlySelectedValues, classes, inFocus, onFocusOption } = this.props;
        const { label, icon } = option;
        const isSelected = !!currentlySelectedValues && currentlySelectedValues.includes(option);
        const renderStyle = Object.assign(
            {},
            OptionsSelectVirtualizedOptionPlain.defaultContainerStyle,
            style,
            currentlySelectedValues && currentlySelectedValues.includes(option) ? 
                OptionsSelectVirtualizedOptionPlain.selectedStyle : null,
            inFocus ? OptionsSelectVirtualizedOptionPlain.inFocusStyle : null,
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
