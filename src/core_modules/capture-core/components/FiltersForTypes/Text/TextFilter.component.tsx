import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { cx } from '@emotion/css';
import { isValidMinCharactersToSearch } from 'capture-core/utils/validation/validators/form/isValidMinCharactersToSearch';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import { searchOperatorHelpTexts, helpTextStyle } from '../../../constants';
import type { UpdatableFilterContent } from '../types';
import type { TextFilterProps, Value } from './Text.types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

const getStyles: any = (theme: any) => ({
    error: {
        ...theme.typography.caption,
        color: theme.palette.error.main,
    },
    errorContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
});

class TextFilterPlain
    extends Component<TextFilterProps & WithStyles<typeof getStyles>>
    implements UpdatableFilterContent<Value> {
    static validateField(value: string, minCharactersToSearch: number) {
        const isValid = isValidMinCharactersToSearch(value, minCharactersToSearch);
        return {
            isValid,
            minCharsError: isValid ? null : TextFilterPlain.errorMessages.MIN_CHARS(minCharactersToSearch),
        };
    }

    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        if (!value) {
            return null;
        }

        return getTextFilterData(value);
    }

    onIsValid() { // NOSONAR -- part of UpdatableFilterContent, called from withButtons
        const { value, minCharactersToSearch } = this.props;
        if (!value || !minCharactersToSearch) return true;
        return TextFilterPlain.validateField(value, minCharactersToSearch).isValid;
    }

    static readonly errorMessages = {
        MIN_CHARS: (min: number) =>
            i18n.t('Please enter at least {{minCharactersToSearch}} character to search', {
                minCharactersToSearch: min,
                count: min,
                defaultValue: 'Please enter at least {{minCharactersToSearch}} character to search',
                defaultValue_plural: 'Please enter at least {{minCharactersToSearch}} characters to search',
            }),
    };

    handleEnterKey = (value: Value) => {
        this.props.onUpdate(value || null);
    }

    handleBlur = (value: string) => {
        this.props.onCommitValue(value || null);
    };

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value);
    });
    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value);
    });

    getErrors() {
        const { value, minCharactersToSearch } = this.props;
        if (!value || !minCharactersToSearch) return { isValid: true, minCharsError: null };
        return TextFilterPlain.validateField(value, minCharactersToSearch);
    }

    render() {
        const { value, searchOperator, classes = {} } = this.props;
        const { minCharsError } = this.getErrors();
        const helpText = searchOperator && searchOperatorHelpTexts[searchOperator];
        const { error: errorClass, errorContainer: errorContainerClass } = classes as {
            error?: string;
            errorContainer?: string;
        };

        return (
            <>
                <EmptyValueFilterCheckboxes
                    value={value}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <Input
                    onBlur={this.handleBlur}
                    onEnterKey={this.handleEnterKey}
                    value={!isEmptyValueFilter(value) ? value : ''}
                />
                {helpText && <div style={helpTextStyle}>{helpText}</div>}
                <div className={cx(errorClass, errorContainerClass)}>
                    {minCharsError}
                </div>
            </>
        );
    }
}

export const TextFilter = withStyles(getStyles)(TextFilterPlain);
