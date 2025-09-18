/* eslint-disable class-methods-use-this */

import * as React from 'react';
import { debounce } from 'lodash';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import VirtualizedSelect from 'react-virtualized-select';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import './optionsSelectVirtualized.css';

import { OptionsSelectVirtualizedOption } from './OptionsSelectVirtualizedOption.component';

export type VirtualizedOptionConfig = {label: string; value: any; icon?: React.ReactNode | null};

const getStyles = () => ({
    selectedOptionContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    selectedIconContainer: {
        paddingLeft: 5,
    },
});

type OwnProps = {
    onSelect: (value: any) => void;
    onFocus?: any | null;
    options: Array<VirtualizedOptionConfig>;
    label?: string;
    value: any;
    nullable?: boolean;
    style?: any | null;
    menuStyle?: any | null;
    maxHeight?: number | null;
    disabled?: boolean | null;
    useHintLabel?: boolean | null;
    required?: boolean | null;
    withoutUnderline?: boolean | null;
    translations: {
        clearText: string;
        noResults: string;
    };
    multi?: boolean | null;
    dataTest?: string;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

type State = {
    filterValue?: string | null;
}

type OptionContainer = {
    focusedOption: VirtualizedOptionConfig;
    focusOption: (option: VirtualizedOptionConfig) => void;
    option: VirtualizedOptionConfig;
    style: any;
    selectValue: (value: VirtualizedOptionConfig) => void;
    valueArray: Array<VirtualizedOptionConfig> | null;
}

class OptionsSelectVirtualizedPlain extends React.Component<Props, State> {
    static getFilteredOptions(options: Array<VirtualizedOptionConfig>, filterValue: any): Array<VirtualizedOptionConfig> {
        const filterValueLC = filterValue.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        return (options && 
            options.filter(o => o.label.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().indexOf(filterValueLC) > -1)) || [];
    }

    materialUIContainerInstance: any;

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

    onBlur = () => {
        this.props.onSelect(this.props.value);
    }

    getValue() {
        const options = this.props.options;
        const selectedValue = this.props.value;
        if (options && selectedValue) {
            return options.find(option => option.value === selectedValue);
        }
        return null;
    }

    prevFilterValue: string | null = null;
    prevFilteredOptions: Array<VirtualizedOptionConfig> = [];
    isUnmounted = false;

    static defaultSelectStyle = {
    };
    static defaultMenuContainerStyle = {
    }

    handleChange(selectedItem: VirtualizedOptionConfig) {
        const selectedValue = selectedItem && selectedItem.value;
        if (selectedValue !== this.props.value) {
            this.props.onSelect(selectedValue === '' ? null : selectedValue);
        }
    }

    handleInputChange = (value: any) => {
        if (!this.isUnmounted) {
            this.setState({ filterValue: value });
        }
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
                OptionsSelectVirtualizedPlain.getFilteredOptions(this.prevFilteredOptions, this.state.filterValue);
        }
        this.prevFilteredOptions = OptionsSelectVirtualizedPlain.getFilteredOptions(
            this.props.options, 
            this.state.filterValue
        );
        this.prevFilterValue = this.state.filterValue;

        return this.prevFilteredOptions;
    }

    renderOption(optionContainer: OptionContainer) {
        const inFocus = optionContainer.option === optionContainer.focusedOption;
        return (
            <OptionsSelectVirtualizedOption
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
        const { icon, label } = option;
        return (
            <div
                className={classes.selectedOptionContainer}
            >
                <div>
                    {label}
                </div>
                {
                    icon ? (
                        <div
                            className={classes.selectedIconContainer}
                        >
                            {icon}
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
        const selectStyle = { ...OptionsSelectVirtualizedPlain.defaultSelectStyle, ...style };
        const menuContainerStyle = { ...OptionsSelectVirtualizedPlain.defaultMenuContainerStyle, ...menuStyle };
        return (
            <div
                data-test="virtualized-select"
                ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}
            >
                <div
                    data-test={dataTest}
                    onBlur={this.onBlur}
                >
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

export const OptionsSelectVirtualized = withStyles(getStyles)(OptionsSelectVirtualizedPlain);
