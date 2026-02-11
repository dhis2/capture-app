import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers } from '@dhis2/ui';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import { searchOperators } from '../../../metaDataMemoryStoreBuilders';
import type { UpdatableFilterContent } from '../types';
import type { TextFilterProps, Value } from './Text.types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

const helpTexts = {
    [searchOperators.EQ]: i18n.t('Exact matches only'),
    [searchOperators.SW]: i18n.t('Must match the start of the value'),
    [searchOperators.EW]: i18n.t('Must match the end of the value'),
};

const helpStyle = {
    marginTop: spacers.dp4,
    marginInline: 0,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: '14px',
    color: colors.grey700,
};

export class TextFilter extends Component<TextFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        return getTextFilterData(value);
    }

    handleEnterKey = (value: Value) => {
        this.props.onUpdate(value || null);
    }

    handleBlur = (value: string) => {
        if (value) {
            this.props.onCommitValue(value);
        }
    };

    handleInputChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)(this.props.onCommitValue);
    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)(this.props.onCommitValue);

    render() {
        const { value, unique, searchOperator } = this.props;
        const helpText = searchOperator && helpTexts[searchOperator];

        return (
            <>
                <EmptyValueFilterCheckboxes
                    value={value}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <Input
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur}
                    onEnterKey={this.handleEnterKey}
                    value={!isEmptyValueFilter(value) ? value : ''}
                    unique={unique}
                />
                {helpText && <div style={helpStyle}>{helpText}</div>}
            </>
        );
    }
}
