// @flow
import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import type { VirtualizedOptionConfig } from './OptionsSelectVirtualized.component';

const getStyles = () => ({
    popper: {
        zIndex: 9999,
    },
    iconContainer: {
        paddingRight: 5,
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
    inFocus?: ?boolean,
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

    static selectedStyle = {};

    render() {
        const { option, style, onSelect, currentlySelectedValues, classes } = this.props;
        const { label, icon } = option;
        const renderStyle = Object.assign(
            {},
            OptionsSelectVirtualizedOption.defaultContainerStyle,
            style,
            currentlySelectedValues && currentlySelectedValues.includes(option) ? OptionsSelectVirtualizedOption.selectedStyle : null,
        );
        return (
            <Tooltip
                title={option.label}
                placement={'bottom'}
                classes={{ popper: classes.popper }}
                enterDelay={800}
            >
                <div
                    className={'virtualized-select-option'}
                    style={renderStyle}
                    onClick={() => {
                        onSelect(option);
                    }}
                >
                    {
                        icon ? (
                            <div
                                className={classes.iconContainer}
                            >
                                {icon}
                            </div>
                        ) : null
                    }
                    <div>
                        {label}
                    </div>
                </div>
            </Tooltip>
        );
    }
}

export default withStyles(getStyles)(OptionsSelectVirtualizedOption);
