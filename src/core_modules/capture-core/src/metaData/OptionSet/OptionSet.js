// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import isArray from 'd2-utilizr/src/isArray';

import Option from './Option';
import { viewTypes } from './optionSet.const';
import errorCreator from '../../utils/errorCreator';
import elementTypes from '../DataElement/elementTypes';
import DataElement from '../DataElement/DataElement';

import type { ConvertFn } from '../DataElement/DataElement';
import type { Value } from './Option';

export default class OptionSet {
    static errorMessages = {
        OPTION_NOT_FOUND: 'Option not found',
        UNSUPPORTED_VIEWTYPE: 'Tried to set unsupported viewType',
    };

    _id: ?string;
    _emptyText: ?string;
    _options: Array<Option>;
    _viewType: ?$Values<typeof viewTypes>;
    _dataElement: ?DataElement;

    constructor(id?: ?string, options?: ?Array<Option>, dataElement?: ?DataElement, viewType?: ?string, onConvert?: ?ConvertFn) {
        this._options = !options ? [] : options.reduce((accOptions: Array<Option>, currentOption: Option) => {
            if (currentOption.value || currentOption.value === false || currentOption.value === 0) {
                currentOption.value =  onConvert ? onConvert(dataElement.type, currentOption.value) : currentOption.value;
                accOptions.push(currentOption);
            } else {
                this._emptyText = currentOption.text;
            }
            return accOptions;
        }, []);

        if (viewType) {
            this.viewType = viewType;
        }

        this._id = id;
        this._dataElement = dataElement;
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): ?string {
        return this._id;
    }

    set viewType(viewType: string) {
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

    getOptions(values: Array<Values>): Array<Option> {
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
            return this.getOptionsTextAsString(values);
        }
        return this.getOptionText(values);
    }

    resolveViewElement(values: Value | Array<Value>, onGetStyle?: (viewType: ?$Values<typeof viewTypes>) => ?Object): ?React$Element<any> | any {
        if (isArray(values)) {
            return values.reduce((accElements, value: Value) => {
                const option = this.options.find(o => o.value === value);
                if (!option) {
                    log.warn(
                        errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
                    );
                } else {
                    accElements.push(
                        <div>
                            {
                                this.getSingleViewElement(option, onGetStyle)
                            }
                        </div>,
                    );
                }

                return accElements;
            }, []);
        }
        return this.getSingleViewElementFromValue(values, onGetStyle);
    }

    getSingleViewElementFromValue(value: Value, onGetStyle?: (viewType: ?$Values<typeof viewTypes>) => ?Object): ?React$Element<any> | any {
        const option = this._options.find(o => o.value === value);
        if (!option) {
            log.warn(
                errorCreator(OptionSet.errorMessages.OPTION_NOT_FOUND)({ OptionSet: this, value }),
            );
            return null;
        }
        return this.getSingleViewElement(option, onGetStyle);
    }

    getSingleViewElement(
        option: Option,
        onGetStyle?: (viewType: ?$Values<typeof viewTypes>)
        => ?Object): ?React$Element<any> | any {
        let element;
        if (this.viewType) {
            const extraStyle = onGetStyle && onGetStyle(this._viewType);
            if (this._viewType === viewTypes.iconWithColor) {
                const [color, icon] = option._text.split(';');
                element = (
                    <FontIcon
                        title={option.description}
                        color={color}
                        style={extraStyle}
                        className="material-icons"
                    >
                        {icon}
                    </FontIcon>
                );
            } else if (this._viewType === viewTypes.icons) {
                element = (
                    <FontIcon
                        title={option.description}
                        style={extraStyle}
                        className="material-icons"
                    >
                        {option.text}
                    </FontIcon>
                );
            } else {
                element = option.text;
            }
        } else {
            element = option.text;
        }

        return element;
    }
}
