// @flow
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import VirtualizedSelect from 'react-virtualized-select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import VirtualizedOption from './OptionsSelectVirtualizedOption.component';
import type{ OptionSet, Option } from '../../../../metaData';

const styles = theme => ({
    inkBar: {
        '&:after': {
            backgroundColor: theme.palette.primary[theme.palette.type === 'light' ? 'dark' : 'light'],
            left: 0,
            zIndex: 200,
            bottom: 1,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '""',
            height: 2,
            position: 'absolute',
            right: 0,
            transform: 'scaleX(0)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeOut,
            }),
            pointerEvents: 'none', // Transparent to the hover style.
        },
        '&$focused:after': {
            transform: 'scaleX(1)',
        },
    },
    focused: {},
    disabled: {
        color: theme.palette.text.disabled,
    },
    underline: {
        '&:before': {
            backgroundColor: theme.palette.input.bottomLine,
            zIndex: 200,
            left: 0,
            bottom: 1,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '""',
            height: 1,
            position: 'absolute',
            right: 0,
            transition: theme.transitions.create('background-color', {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.ease,
            }),
            pointerEvents: 'none', // Transparent to the hover style.
        },
        '&:hover:not($disabled):before': {
            backgroundColor: theme.palette.text.primary,
            height: 2,
        },
        '&$disabled:before': {
            background: 'transparent',
            backgroundImage: `linear-gradient(to right, ${
                theme.palette.input.bottomLine
            } 33%, transparent 0%)`,
            backgroundPosition: 'left top',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '5px 1px',
        },
    },
    selectRootBase: {
        position: 'relative',
        paddingTop: '2px',
    },
    selectRootWithLabel: {
        paddingTop: '12px',
    },
    root: {
        position: 'relative',
    },
    formControl: {
        width: '100%',
        zIndex: '200',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    labelInFocus: {
        color: theme.palette.primary[theme.palette.type === 'light' ? 'dark' : 'light'],
    },
});

export type virtualizedOptionConfig = {label: string, value: any};

type Props = {
    onBlur: (value: any) => void,
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
};

type State = {
    inFocus: boolean,
};

class OptionsSelectVirtualized extends Component<Props, State> {
    // $FlowFixMe[incompatible-type] automated comment
    handleChange: (e: Object, index: number, value: any) => void;
    handleFocus: () => void;
    handleBlur: () => void;
    materialUIContainerInstance: any;
    options: ?Array<{label: string, value: any}>;
    renderOption: () => React$Element<any>;
    inFocusLabelClasses: Object;
    yourSelect: any;

    static defaultProps = {
        translations: {
            clearText: '',
            noResults: '',
        },
    };
    constructor(props: Props) {
        super(props);
        this.state = { inFocus: false };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.renderOption = this.renderOption.bind(this);

        this.options = this.buildOptions(this.props.optionSet);
        this.inFocusLabelClasses = {
            root: this.props.classes.labelInFocus,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (nextProps.optionSet !== this.props.optionSet) {
            this.options = this.buildOptions(nextProps.optionSet);
        }
    }

    static defaultSelectStyle = {
        border: 'none',
        outline: 'none',
        borderRadius: 0,
    };
    static defaultMenuContainerStyle = {
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
            this.props.onBlur(selectedValue === '' ? null : selectedValue);
        }
    }

    handleFocus() {
        this.setState({ inFocus: true });
    }

    handleBlur() {
        this.setState({ inFocus: false });
    }

    getValue() {
        const options = this.options;
        const selectedValue = this.props.value;
        if (options && selectedValue) {
            return options.find(option => option.value === selectedValue);
        }
        return null;
    }

    renderOption({ option, style, selectValue, valueArray }: {option: virtualizedOptionConfig, style: Object, selectValue: (value: virtualizedOptionConfig) => void, valueArray: ?Array<virtualizedOptionConfig>}) {
        return (
            <VirtualizedOption
                key={option.value}
                option={option}
                style={style}
                onSelect={selectValue}
                currentlySelectedValues={valueArray}
            />

        );
    }

    render() {
        // $FlowFixMe[prop-missing] automated comment
        const { optionSet, label, value, nullable, style, menuStyle, maxHeight, disabled, required, useHintLabel, onChange, onBlur, classes, translations, withoutUnderline, ...toSelect } = this.props;
        const { inFocus } = this.state;
        // $FlowFixMe[prop-missing] automated comment
        const calculatedValue = toSelect.multi ? value : this.getValue();
        const labelIsShrinked = !!calculatedValue || this.state.inFocus;

        const lineClasses = classNames(classes.underline, classes.inkBar, { [classes.focused]: inFocus });
        const selectRootClasses = classNames(
            classes.selectRootBase,
            { [classes.selectRootWithLabel]: label },
            { [lineClasses]: !withoutUnderline },
        );

        const selectStyle = { ...OptionsSelectVirtualized.defaultSelectStyle, ...style };
        const menuContainerStyle = { ...OptionsSelectVirtualized.defaultMenuContainerStyle, ...menuStyle };
        return (
            <div
                ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}
                className={classes.root}
                id="option1"
            >
                {
                    (() => (
                        <FormControl component="fieldset" className={classes.formControl}>
                            <InputLabel
                                shrink={labelIsShrinked}
                                disabled={!!disabled}
                                required={!!required}
                                classes={inFocus ? this.inFocusLabelClasses : null}
                            >
                                {label}
                            </InputLabel>
                        </FormControl>
                    ))()
                }

                <div
                    className={selectRootClasses}
                >
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
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
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        noResultsText={translations.noResults}
                        {...toSelect}
                    />

                    <div />

                </div>
            </div>
        );
    }
}

export default withStyles(styles)(OptionsSelectVirtualized);
