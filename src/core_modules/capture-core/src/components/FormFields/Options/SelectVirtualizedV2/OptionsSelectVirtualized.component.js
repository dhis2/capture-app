// @flow
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';

import VirtualizedSelect from 'react-virtualized-select';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import './optionsSelectVirtualized.css';

import VirtualizedOption from './OptionsSelectVirtualizedOption.component';
import OptionSet from '../../../../metaData/OptionSet/OptionSet';
import Option from '../../../../metaData/OptionSet/Option';
import withFocusHandler from '../../../d2UiReactAdapters/internal/TextInput/withFocusHandler';


export type virtualizedOptionConfig = {label: string, value: any};

type Props = {
    onSelect: (value: any) => void,
    onFocus: any,
    optionSet: OptionSet,
    label?: string,
    value: any,
    nullable?: boolean,
    style?: ?Object,
    menuStyle?: ?Object,
    maxHeight?: ?number,
    disabled?: ?boolean,
    useHintLabel?: ?boolean,
    classes: Object,
    required?: ?boolean,
    withoutUnderline?: ?boolean,
    translations: {
        clearText: string,
        noResults: string,
    },
    multi?: ?boolean,
};

type State = {
    filterValue?: ?string;
}

type OptionContainer = {
    option: virtualizedOptionConfig,
    style: Object,
    selectValue: (value: virtualizedOptionConfig) => void,
    valueArray: ?Array<virtualizedOptionConfig>,
}

class OptionsSelectVirtualized extends Component<Props, State> {
    static defaultSelectStyle = {
    };
    static defaultMenuContainerStyle = {
        width: 'auto',
    }

    static defaultProps = {
        translations: {
            clearText: '',
            noResults: '',
        },
    };
    static getFilteredOptions(options: ?Array<{label: string, value: any}>, filterValue: any) {
        return (options && options.filter(o => o.label.toLowerCase().indexOf(filterValue) > -1)) || [];
    }

    handleChange: (e: Object, index: number, value: any) => void;
    materialUIContainerInstance: any;
    options: ?Array<{label: string, value: any}>;
    filterOptions: any;
    renderOption: () => React$Element<any>;
    yourSelect: any;
    prevFilterValue: ?string;
    prevFilteredOptions: ?Array<{label: string, value: any}>;


    constructor(props: Props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.handleInputChange = debounce(this.handleInputChange, 500);

        this.options = this.buildOptions(this.props.optionSet);
        this.state = {};
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.optionSet !== this.props.optionSet) {
            this.options = this.buildOptions(nextProps.optionSet);
        }
    }

    filterOptions = () => {
        if (!this.state.filterValue) {
            return this.options;
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
        this.prevFilteredOptions = OptionsSelectVirtualized.getFilteredOptions(this.options, this.state.filterValue);
        this.prevFilterValue = this.state.filterValue;

        return this.prevFilteredOptions;
    }

    handleInputChange = (value: any) => {
        this.setState({ filterValue: value });
    }

    buildOptions(optionSet: OptionSet) {
        const options = optionSet.options.map(
            (o: Option) => ({
                label: o.text,
                value: o.value,
            }),
        );
        return options;
    }

    handleChange(selectedItem: ?virtualizedOptionConfig) {
        const selectedValue = selectedItem && selectedItem.value;
        if (selectedValue !== this.props.value) {
            this.props.onSelect(selectedValue === '' ? null : selectedValue);
        }
    }

    getValue() {
        const options = this.options;
        const selectedValue = this.props.value;
        if (options && selectedValue) {
            return options.find(option => option.value === selectedValue);
        }
        return null;
    }

    renderOption(optionContainer: OptionContainer) {
        return (
            <VirtualizedOption
                key={optionContainer.option.value}
                option={optionContainer.option}
                style={optionContainer.style}
                onSelect={optionContainer.selectValue}
                currentlySelectedValues={optionContainer.valueArray}
            />

        );
    }

    render() {
        const {
            optionSet,
            label,
            value,
            nullable,
            style,
            menuStyle,
            maxHeight,
            disabled,
            required,
            useHintLabel,
            classes,
            translations,
            withoutUnderline,
            ...toSelect } = this.props;
        const calculatedValue = toSelect.multi ? value : this.getValue();
        const selectRootClasses = classNames(
            classes.selectRootBase,
            { [classes.selectRootWithLabel]: label },
        );
        const selectStyle = { ...OptionsSelectVirtualized.defaultSelectStyle, ...style };
        const menuContainerStyle = { ...OptionsSelectVirtualized.defaultMenuContainerStyle, ...menuStyle };
        return (
            <div
                ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}
                className={classes.root}
            >
                <div
                    className={selectRootClasses}
                >
                    <VirtualizedSelect
                        ref={(select) => { this.yourSelect = select; }}
                        disabled={disabled}
                        options={this.options}
                        onChange={this.handleChange}
                        value={calculatedValue}
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

export default withFocusHandler()(OptionsSelectVirtualized);
