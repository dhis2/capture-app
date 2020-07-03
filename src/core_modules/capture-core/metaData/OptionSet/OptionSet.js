// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import isArray from 'd2-utilizr/lib/isArray';
import { errorCreator } from 'capture-core-utils';
import Option from './Option';
import OptionGroup from './OptionGroup';
import { viewTypes, inputTypes, inputTypesAsArray } from './optionSet.const';
import DataElement from '../DataElement/DataElement';

import type { ConvertFn } from '../DataElement/DataElement';
import type { Value } from './Option';

export default class OptionSet {
    static errorMessages = {
        OPTION_NOT_FOUND: 'Option not found',
        UNSUPPORTED_VIEWTYPE: 'Tried to set an unsupported viewType',
        UNSUPPORTED_INPUTTYPE: 'Tried to set an unsuported inputType',
    };

    _id: ?string;
    _emptyText: ?string;
    _options: Array<Option>;
    _optionGroups: Map<string, OptionGroup>;
    _viewType: $Values<typeof viewTypes>;
    _inputType: $Values<typeof inputTypes>;
    _dataElement: ?DataElement;

    constructor(
        id?: ?string,
        options?: ?Array<Option>,
        optionGroups?: ?Map<string, OptionGroup>,
        dataElement?: ?DataElement,
        onConvert?: ?ConvertFn) {
        this._options = !options ? [] : options.reduce((accOptions: Array<Option>, currentOption: Option) => {
            if (currentOption.value || currentOption.value === false || currentOption.value === 0) {
                currentOption.value = onConvert && dataElement ?
                    onConvert(currentOption.value, dataElement.type, dataElement) :
                    currentOption.value;
                accOptions.push(currentOption);
            } else {
                this._emptyText = currentOption.text;
            }
            return accOptions;
        }, []);

        this._optionGroups = optionGroups || new Map();

        this._id = id;
        this._dataElement = dataElement;
        this._inputType = inputTypes.DROPDOWN;
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): ?string {
        return this._id;
    }

    set inputType(inputType: ?string) {
        if (!inputType) {
            return;
        }

        if (inputTypesAsArray.includes(inputType)) {
            this._inputType = inputType;
        } else {
            log.warn(errorCreator(OptionSet.errorMessages.UNSUPPORTED_INPUTTYPE)({ optionSet: this, inputType }));
        }
    }
    get inputType(): $Values<typeof inputTypes> {
        return this._inputType;
    }

    set viewType(viewType: ?string) {
        if (!viewType) {
            return;
        }

        if (viewTypes[viewType]) {
            this._viewType = viewType;
        } else {
            log.warn(errorCreator(OptionSet.errorMessages.UNSUPPORTED_VIEWTYPE)({ optionSet: this, viewType }));
        }
    }
    get viewType(): ?string {
        return this._viewType;
    }

    get emptyText(): ?string {
        return this._emptyText;
    }
    set emptyText(emptyText?: ?string): ?string {
        this._emptyText = emptyText;
    }

    get options(): Array<Option> {
        return this._options;
    }

    get optionGroups(): Map<string, OptionGroup> {
        return this._optionGroups;
    }

    set optionGroups(optionGroups: Map<string, OptionGroup>) {
        this._optionGroups = optionGroups;
    }

    get dataElement(): ?DataElement {
        return this._dataElement;
    }

    addOption(option: Option) {
        if (option.value || option.value === false || option.value === 0) {
            this._options.push(option);
        } else {
            this._emptyText = option.text;
        }
    }

    getOptionThrowIfNotFound(value: Value): Option {
        const option = this.options.find(o => o.value === value);
        if (!option) {
            throw new Error(
                errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
            );
        }
        return option;
    }

    getOption(value: Value): ?Option {
        const option = this.options.find(o => o.value === value);
        if (!option) {
            log.warn(
                errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
            );
        }
        return option;
    }

    getOptionsThrowIfNotFound(values: Array<Value>): Array<Option> {
        return values.map((value: Value) => {
            const option = this.options.find(o => o.value === value);
            if (!option) {
                throw new Error(
                    errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
                );
            }
            return option;
        });
    }

    getOptions(values: Array<Value>): Array<Option> {
        return values.reduce((accOptions: Array<Option>, value: Value) => {
            const option = this.options.find(o => o.value === value);
            if (option) {
                accOptions.push(option);
            } else {
                log.warn(
                    errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
                );
            }
            return accOptions;
        }, []);
    }

    getOptionText(value: Value): ?string {
        const option = this.getOption(value);
        return option && option.text;
    }

    getOptionsText(values: Array<Value>): Array<string> {
        const options = this.getOptions(values);
        return options.map((option: Option) => option.text);
    }

    getOptionsTextAsString(values: Array<Value>): string {
        const texts = this.getOptionsText(values);
        return texts.toString();
    }

    resolveTextsAsString(values: Value | Array<Value>): ?string {
        if (isArray(values)) {
           
            // $FlowFixMe[incompatible-call] automated comment
            return this.getOptionsTextAsString(values);
        }
       
        // $FlowFixMe[incompatible-call] automated comment
        return this.getOptionText(values);
    }
}
