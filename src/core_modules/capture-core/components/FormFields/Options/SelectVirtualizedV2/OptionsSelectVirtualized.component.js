// @flow
/* eslint-disable class-methods-use-this */

import * as React from 'react';
import { debounce } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import VirtualizedSelect from 'react-virtualized-select';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import './optionsSelectVirtualized.css';

import VirtualizedOption from './OptionsSelectVirtualizedOption.component';

export type VirtualizedOptionConfig = {label: string, value: any, iconLeft?: ?React.Node, iconRight?: ?React.Node };

const getStyles = () => ({
    selectedOptionContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    selectedIconLeftContainer: {
        paddingRight: 5,
    },
    selectedIconRightContainer: {
        paddingLeft: 5,
    },
});


type Props = {
    onSelect: (value: any) => void,
    onFocus?: ?any,
    options: Array<VirtualizedOptionConfig>,
    label?: string,
    value: any,
    nullable?: boolean,
    style?: ?Object,
    menuStyle?: ?Object,
    maxHeight?: ?number,
    disabled?: ?boolean,
    useHintLabel?: ?boolean,
    required?: ?boolean,
    withoutUnderline?: ?boolean,
    translations: {
        clearText: string,
        noResults: string,
    },
    multi?: ?boolean,
    classes: {
        selectedOptionContainer: string,
        selectedIconLeftContainer: string,
        selectedIconRightContainer: string,
    },
    dataTest?: string,
};

type State = {
    filterValue?: ?string;
}

type OptionContainer = {
    focusedOption: VirtualizedOptionConfig,
    focusOption: (option: VirtualizedOptionConfig) => void,
    option: VirtualizedOptionConfig,
    style: Object,
    selectValue: (value: VirtualizedOptionConfig) => void,
    valueArray: ?Array<VirtualizedOptionConfig>,
}

class OptionsSelectVirtualized extends React.Component<Props, State> {
    static getFilteredOptions(options: Array<VirtualizedOptionConfig>, filterValue: any): Array<VirtualizedOptionConfig> {
        const filterValueLC = filterValue.toLowerCase();
        return (options && options.filter(o => o.label.toLowerCase().indexOf(filterValueLC) > -1)) || [];
    }

    handleChange: (selectedItem: VirtualizedOptionConfig) => void;
    materialUIContainerInstance: any;
    filterOptions: any;
    renderOption: () => React$Element<any>;
    prevFilterValue: ?string;
    prevFilteredOptions: Array<VirtualizedOptionConfig>;
    isUnmounted: boolean;

    static defaultProps = {
        translations: {
            clearText: '',
            noResults: '',
        },
    };

    constructor(props: Props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.handleInputChange = debounce(this.handleInputChange, 500);
        this.prevFilteredOptions = [];
        this.state = {};
        this.isUnmounted = false;
    }

    UNSAFE_componentWillReceiveProps(newProps: Props) {
        if (newProps.options !== this.props.options) {
            this.prevFilterValue = null;
        }
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    static defaultSelectStyle = {
    };
    static defaultMenuContainerStyle = {
    }

    filterOptions = () => {
        if (!this.state.filterValue) {
            return this.props.options;
        }
        if (this.prevFilterValue === this.state.filterValue) {
            return this.prevFilteredOptions;
        }
        if (this.state.filterValue &&
            this.prevFilterValue &&
            this.state.filterValue.indexOf(this.prevFilterValue) > -1
        ) {
            this.prevFilteredOptions =
                OptionsSelectVirtualized.getFilteredOptions(this.prevFilteredOptions, this.state.filterValue);
        }
        this.prevFilteredOptions = OptionsSelectVirtualized.getFilteredOptions(this.props.options, this.state.filterValue);
        this.prevFilterValue = this.state.filterValue;

        return this.prevFilteredOptions;
    }

    handleInputChange = (value: any) => {
        if (!this.isUnmounted) {
            this.setState({ filterValue: value });
        }
    }

    handleChange(selectedItem: VirtualizedOptionConfig) {
        const selectedValue = selectedItem && selectedItem.value;
        if (selectedValue !== this.props.value) {
            this.props.onSelect(selectedValue === '' ? null : selectedValue);
        }
    }

    getValue() {
        const options = this.props.options;
        const selectedValue = this.props.value;
        if (options && selectedValue) {
            return options.find(option => option.value === selectedValue);
        }
        return null;
    }

    renderOption(optionContainer: OptionContainer) {
        const inFocus = optionContainer.option === optionContainer.focusedOption;
        return (
            <VirtualizedOption
                key={optionContainer.option.value}
                option={optionContainer.option}
                inFocus={inFocus}
                onFocusOption={optionContainer.focusOption}
                style={optionContainer.style}
                onSelect={optionContainer.selectValue}
                currentlySelectedValues={optionContainer.valueArray}
            />

        );
    }

    renderValue = (option: VirtualizedOptionConfig) => {
        const { classes } = this.props;
        const { iconLeft, iconRight, label } = option;
        return (
            <div
                className={classes.selectedOptionContainer}
            >
                {
                    iconLeft ? (
                        <div
                            className={classes.selectedIconLeftContainer}
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
                            className={classes.selectedIconRightContainer}
                        >
                            {iconRight}
                        </div>
                    ) : null
                }
            </div>
        );
    }

    render() {
        const {
            options,
            label,
            value,
            nullable,
            style,
            menuStyle,
            maxHeight,
            disabled,
            required,
            useHintLabel,
            translations,
            withoutUnderline,
            classes,
            dataTest,
            ...toSelect } = this.props;
        const calculatedValue = toSelect.multi ? value : this.getValue();
        const selectStyle = { ...OptionsSelectVirtualized.defaultSelectStyle, ...style };
        const menuContainerStyle = { ...OptionsSelectVirtualized.defaultMenuContainerStyle, ...menuStyle };
        return (
            <div
                data-test="dhis2-capture-virtualized-select"
                ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}
            >
                <div
                    data-test={dataTest}
                >
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <VirtualizedSelect
                        disabled={disabled}
                        options={options}
                        onChange={this.handleChange}
                        value={calculatedValue}
                        valueRenderer={this.renderValue}
                        clearable={nullable}
                        style={selectStyle}
                        menuContainerStyle={menuContainerStyle}
                        className={'virtualized-select'}
                        placeholder={useHintLabel ? label : ''}
                        maxHeight={maxHeight || 200}
                        optionRenderer={this.renderOption}
                        clearValueText={translations.clearText}
                        noResultsText={translations.noResults}
                        filterOptions={this.filterOptions}
                        onInputChange={this.handleInputChange}
                        {...toSelect}
                    />
                    <div />
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(OptionsSelectVirtualized);
