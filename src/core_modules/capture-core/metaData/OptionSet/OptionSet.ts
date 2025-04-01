/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import isArray from 'd2-utilizr/lib/isArray';
import { errorCreator } from 'capture-core-utils';
import { viewTypes, inputTypes, inputTypesAsArray } from './optionSet.const';
import { DataElement } from '../DataElement';
import type { ConvertFn } from '../DataElement/DataElement';
import type { Option, Value } from './Option';
import type { OptionGroup } from './OptionGroup';
import type { CachedAttributeValue } from '../../storageControllers';

export class OptionSet {
    static errorMessages = {
        OPTION_NOT_FOUND: 'Option not found',
        UNSUPPORTED_VIEWTYPE: 'Tried to set an unsupported viewType',
        UNSUPPORTED_INPUTTYPE: 'Tried to set an unsuported inputType',
    };
    static multiOptionsValuesSeparator = ',';

    private _id?: string;
    private _emptyText?: string;
    private _attributeValues: CachedAttributeValue[];
    private _options: Option[];
    private _optionGroups: Map<string, OptionGroup>;
    private _viewType?: keyof typeof viewTypes;
    private _inputType: keyof typeof inputTypes;
    private _dataElement?: DataElement;

    constructor(
        id?: string,
        options?: Option[],
        optionGroups?: Map<string, OptionGroup>,
        dataElement?: DataElement,
        onConvert?: ConvertFn,
        attributeValues?: CachedAttributeValue[],
    ) {
        this._options = !options ? [] : options.reduce((accOptions: Option[], currentOption: Option) => {
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
        this._attributeValues = attributeValues || [];
        this._inputType = inputTypes.DROPDOWN as keyof typeof inputTypes;
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string | undefined {
        return this._id;
    }

    set inputType(inputType: string) {
        if (!inputType) {
            return;
        }

        if (inputTypesAsArray.includes(inputType)) {
            this._inputType = inputType as keyof typeof inputTypes;
        } else {
            log.warn(errorCreator(OptionSet.errorMessages.UNSUPPORTED_INPUTTYPE)({ optionSet: this, inputType }));
        }
    }

    get inputType(): keyof typeof inputTypes {
        return this._inputType;
    }

    set viewType(viewType: string) {
        if (!viewType) {
            return;
        }

        if (viewType in viewTypes) {
            this._viewType = viewType as keyof typeof viewTypes;
        } else {
            log.warn(errorCreator(OptionSet.errorMessages.UNSUPPORTED_VIEWTYPE)({ optionSet: this, viewType }));
        }
    }
    get viewType(): keyof typeof viewTypes | undefined {
        return this._viewType;
    }

    get emptyText(): string | undefined {
        return this._emptyText;
    }
    set emptyText(emptyText: string) {
        this._emptyText = emptyText;
    }

    get attributeValues(): CachedAttributeValue[] {
        return this._attributeValues;
    }

    set attributeValues(value: CachedAttributeValue[]) {
        this._attributeValues = value;
    }

    get options(): Option[] {
        return this._options;
    }

    get optionGroups(): Map<string, OptionGroup> {
        return this._optionGroups;
    }

    set optionGroups(optionGroups: Map<string, OptionGroup>) {
        this._optionGroups = optionGroups;
    }

    get dataElement(): DataElement | undefined {
        return this._dataElement;
    }

    addOption(option: Option): void {
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
                errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }).message,
            );
        }
        return option;
    }

    getOption(value: Value): Option | undefined {
        const option = this.options.find(o => o.value === value);
        if (!option) {
            log.warn(
                errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
            );
        }
        return option;
    }

    getOptionsThrowIfNotFound(values: Value[]): Option[] {
        return values.map((value: Value) => {
            const option = this.options.find(o => o.value === value);
            if (!option) {
                throw new Error(
                    errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }).message,
                );
            }
            return option;
        });
    }

    getOptions(values: Value[]): Option[] {
        return values.reduce((accOptions: Option[], value: Value) => {
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

    getOptionText(value: Value): string | undefined {
        const option = this.getOption(value);
        return option?.text;
    }

    getOptionsText(values: Value[]): string[] {
        const options = this.getOptions(values);
        return options.map((option: Option) => option.text);
    }

    getMultiOptionsText(codes: string): string {
        return codes.split(OptionSet.multiOptionsValuesSeparator).reduce((acc: string[], code) => {
            const option = this.options.find(o => o.value === code);
            if (option) {
                acc.push(option.text);
            } else {
                log.warn(errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, code }));
            }
            return acc;
        }, []).join(`${OptionSet.multiOptionsValuesSeparator} `);
    }

    getOptionsTextAsString(values: Value[]): string {
        const texts = this.getOptionsText(values);
        return texts.toString();
    }

    resolveTextsAsString(values: Value | Value[]): string | undefined {
        if (isArray(values)) {
            return this.getOptionsTextAsString(values as Value[]);
        }

        return this.getOptionText(values as Value);
    }
}
